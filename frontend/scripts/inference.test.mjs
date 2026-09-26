import test from 'node:test';
import assert from 'node:assert/strict';
import { detectFrame } from '../src/inference-client.js';
import { CameraFeed } from '../src/components/03-organisms/camera-feed.js';

function fakeFeed() {
  const fakeCanvas = () => ({ width: 1920, height: 1080, getContext: () => ({ drawImage() {} }), toBlob: callback => callback(new Blob(['jpeg'], { type: 'image/jpeg' })) });
  const feed = Object.create(CameraFeed.prototype);
  Object.assign(feed, {
    view: 'aerial', detectionEpoch: 1, processingFrameId: 0, inferenceEnabled: true,
    paused: false, resultReady: false, detections: [], presentations: [], countUpdates: [],
    video: { videoWidth: 1920, videoHeight: 1080, currentTime: 9.2 },
    inferenceCanvas: fakeCanvas(), captureCanvas: fakeCanvas(),
    element: { querySelector: () => ({ value: '1280' }) },
    drawVideo(source) { this.presentations.push(source); this.videoRect = { x: 0, y: 30, width: 960, height: 540 }; },
    updateBoxes() {}, onDetections() { this.countUpdates.push(this.detections.length); }, setLabel() {},
  });
  return feed;
}

test('inference refuses a response for a different source/frame', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ view: 'ground', frame_id: 10 }), { status: 200 }));
  await assert.rejects(detectFrame('aerial', 10, new Blob(['frame'])), /unexpected frame/);
});

test('server errors are surfaced rather than returned as detections', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ detail: 'Weights missing' }), { status: 503 }));
  await assert.rejects(detectFrame('ground', 1, new Blob(['frame'])), /Weights missing/);
});

test('source replacement discards an in-flight response', async t => {
  let resolveResponse;
  t.mock.method(globalThis, 'fetch', () => new Promise(resolve => { resolveResponse = resolve; }));
  const feed = fakeFeed();
  const pending = feed.inferCurrentFrame();
  await new Promise(resolve => setImmediate(resolve));
  feed.detectionEpoch++;
  feed.detections = [{ id: 'new-source-marker' }];
  resolveResponse(new Response(JSON.stringify({ view: 'aerial', frame_id: 1, detections: [] }), { status: 200 }));
  await pending;
  assert.equal(feed.detections[0].id, 'new-source-marker');
  assert.equal(feed.lastResult, undefined);
});

test('boxes map onto the processed letterboxed frame, preserving source timestamp', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({
    view: 'aerial', frame_id: 1, model: 'test detector', inference_ms: 10,
    detections: [{ id: 'A-1-1', bbox_normalized: [.25, .25, .1, .2], confidence: .8 }],
  }), { status: 200 }));
  const feed = fakeFeed();
  await feed.inferCurrentFrame();
  assert.deepEqual(feed.detections[0].bbox, [240, 165, 96, 108]);
  assert.equal(feed.displayedVideoTime, 9.2);
  assert.equal(feed.resultReady, true);
  assert.equal(feed.inFlight, false);
});

for (const view of ['ground', 'aerial']) {
  test(`${view} keeps the displayed image, boxes and crop source while the next frame is processing`, async t => {
    let finish;
    t.mock.method(globalThis, 'fetch', () => new Promise(resolve => { finish = resolve; }));
    const feed = fakeFeed();
    feed.view = view;
    feed.resultReady = true;
    feed.detections = [{ id: 'previous-frame-person' }];
    feed.displayedVideoTime = 8;
    const displayedFrame = feed.inferenceCanvas;
    const capturedFrame = feed.captureCanvas;
    const pending = feed.inferCurrentFrame();
    const response = () => new Response(JSON.stringify({ view, frame_id: 1, model: 'test', inference_ms: 10, detections: [] }), { status: 200 });
    t.after(async () => { finish?.(response()); await pending; });
    await new Promise(resolve => setImmediate(resolve));
    // A slow request must not show an unannotated frame or flash the count to zero.
    assert.equal(feed.detections[0]?.id, 'previous-frame-person');
    assert.equal(feed.resultReady, true);
    assert.equal(feed.inferenceCanvas, displayedFrame);
    assert.equal(feed.displayedVideoTime, 8);
    assert.equal(feed.presentations.length, 0);
    assert.deepEqual(feed.countUpdates, []);
    finish(response());
    await pending;
    // A genuinely empty result must clear the old boxes, together with the new image.
    assert.deepEqual(feed.detections, []);
    assert.equal(feed.inferenceCanvas, capturedFrame);
    assert.equal(feed.displayedVideoTime, 9.2);
    assert.deepEqual(feed.presentations, [capturedFrame]);
    assert.deepEqual(feed.countUpdates, [0]);
  });
}

for (const frozenState of ['paused', 'cropping']) {
  test(`an arriving result cannot replace a ${frozenState} reference frame`, async t => {
    let finish;
    t.mock.method(globalThis, 'fetch', () => new Promise(resolve => { finish = resolve; }));
    const feed = fakeFeed();
    const displayedFrame = feed.inferenceCanvas;
    const pending = feed.inferCurrentFrame();
    await new Promise(resolve => setImmediate(resolve));
    feed[frozenState] = true;
    finish(new Response(JSON.stringify({ view: 'aerial', frame_id: 1, model: 'test', inference_ms: 10, detections: [] }), { status: 200 }));
    await pending;
    assert.equal(feed.inferenceCanvas, displayedFrame);
    assert.equal(feed.presentations.length, 0);
    assert.equal(feed.lastResult, undefined);
    feed[frozenState] = false;
    feed.presentPendingResult();
    assert.equal(feed.presentations.length, 1);
    assert.equal(feed.lastResult.frame_id, 1);
  });
}
