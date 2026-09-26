# Drone Lock / BIRDS EYE — project context

Current source: the user supplied `C:\Users\hp\Downloads\FYP document-1.pdf` (17 pages, title **Drone Lock — Ground to Aerial Person Re-identification**) as the updated final document. It supersedes the earlier `D:\fyp scope.pdf` (18 pages, BIRDS EYE). The current UI still uses BIRDS EYE branding. These notes summarize the supplied scope; they do not treat proposed features as completed or independently certify approval.

## Current user priority

Show ground and aerial sources, display model detections, and select one person as the reference. The user selected two public detector checkpoints, which are downloaded and integrated, and is testing uploaded videos. The user explicitly defers generative view synthesis because no trained generator is available yet. Persistent aerial tracklets, crop collection and the matching interface can be developed independently. The existing automatic reference selection is an explicitly scripted demo.

## Proposed end-to-end system

The updated PDF describes: ground CCTV detection → ground-to-aerial GAN view synthesis → lightweight ViT appearance embedding → local MQTT handover → drone dispatch → aerial person detection → lightweight ViT feature matching with cosine similarity → single-target following → target-loss/low-battery return.

The scope describes one ground camera, one drone and one actively followed target, local Wi-Fi/Mosquitto MQTT, MAVLink flight control, automatic/manual modes, and Kalman prediction. The revised research core is a conditional/view-translation GAN plus a Siamese matcher with lightweight ViT feature extraction and attention. Its performance and identity-preservation statements are research objectives, not established results for this implementation.

Relevant proposal sections:

- Section 3, pages 6–7: objectives, scope and operational limits.
- Section 4.1, pages 7–8: proposed bilateral preprocessing, YOLO26 Nano ground detection, GAN view synthesis and ViT embedding.
- Sections 4.3–4.5, pages 8–10: aerial detection, cosine similarity between ViT embeddings, and subsequent tracking/following.
- Sections 4.6–4.7, page 10: web mission interface and visualization/reporting.
- Section 5 and Figure 1, pages 11–12: proposed system architecture and local wireless handover. Figure 1 retains the earlier BIRDS EYE title and does not show all of the text's generative stages.
- Section 6, pages 12–14: GAN plus Siamese ViT specification, limits and proposed datasets.
- Section 7, pages 14–15: planned YOLO26 Nano (ground), YOLO26 Small (aerial), cGAN, lightweight ViT, MQTT/MAVLink, React and Streamlit/Dash.

## Additional pipeline supplied in chat

The user also supplied a more detailed flow, with these proposed stages:

1. Ground photo/reference → detection → isolated crop, labelled `256x128` in the diagram (height/width convention must be defined when implementing).
2. U-Net ground-to-aerial generator → synthetic aerial image → Re-ID feature embedding (labelled 2048-dimensional).
3. Aerial video → detection + ByteTrack → candidate tracklets → Re-ID embeddings in the same feature space.
4. Cosine ranking → top three candidate tracklets.
5. Generate ground views from representative real crops of those aerial candidates → compare with the original ground reference → decide a final target or abstain.
6. Render the selected target's trajectory and export JSON plus processed video.

The reverse aerial-to-ground generation, top-three reranking, U-Net architecture, exact crop size and 2048-dimensional embedding are specified in the chat diagram, not explicitly in the PDF. The PDF names a cGAN and a lightweight ViT, while the diagram labels both detectors YOLO11. Treat the chat flow as the user's intended extension; do not silently describe all of those details as PDF requirements or replace the installed detectors on that basis.

The chat wording suggested matching first and generating later; the pasted flow generates the reference aerial view before the first cosine ranking. The PDF likewise places ground-to-aerial generation before its main match. The user defers both generation directions for now.

Feature extraction remains part of both descriptions: a generator produces an image, an encoder produces a comparable numerical embedding, and cosine similarity compares embeddings. The PDF's phrase about eliminating flat feature matching describes comparing synthesized and real aerial appearances, not removing feature extraction. The reverse check still needs a defined comparison method; using the same encoder on generated and original ground crops is a proposed implementation, not a detailed algorithm already specified by the PDF. Cosine similarity does not require exactly 2048 dimensions. Preserve generator and encoder provenance, use compatible trained embeddings, and evaluate before treating a score as an accepted match. A generated round trip is supporting evidence, not independent identity proof.

## Existing implementation

The root Python code implements YOLO-based detection/tracking of a single input source, zone intrusion/proximity logic, and evidence logging. It has no explicit appearance-embedding model, cross-view identity matching, generative view synthesis, MQTT handover, or drone-control implementation.

`frontend/` is a local dashboard served with the FastAPI backend in `app.py`. It uses explicitly scripted canvas scenes for demos and actual model inference on sampled frames from local videos or browser webcams. Each real overlay is aligned to its processed frame. Users can select a detection or draw a reference crop, then export the crop and metadata. Detection IDs are frame-specific; the dashboard does not perform persistent tracking or cross-camera matching.

The selected models are [MOT20 YOLO26s pedestrian](https://huggingface.co/Halftom/mot20-yolo26s-pedestrian) for ground frames and the [VisDrone YOLO11n person checkpoint](https://github.com/pratap424/visdrone_mot) for aerial frames. Both use model class 0 for people. The registry pins file hashes, and downloads and loads verify them. These differ from the exact variants named in the PDF and chat diagram; retain the user's working detector choices pending an explicit implementation decision. The original `detect.py` CLI can also use either profile with `--view`. Its `model.track()` call does not explicitly select ByteTrack; the installed Ultralytics default currently names `tracktrack.yaml`. The dashboard uses `predict()` only. Neither should be documented as the proposed ByteTrack tracklet module being complete.

Both checkpoints have passed loading, inference, live API, and short CLI execution checks on this machine. Those checks do not establish accuracy on aerial footage, cross-view performance, or real-time throughput. CPU operation is the current default.

Generation, Re-ID, MQTT, and flight operations are not implemented. The static JavaScript dashboard is an initial prototype, not the React stack named in the proposal.

## Important distinctions for future work

- A detection box finds a person; a tracking ID follows a local track; Re-ID compares identity across views.
- Detect multiple candidate people, but select and follow one target in this FYP scope.
- The primary handover is ground to aerial. The user's chat diagram adds reverse generation for candidate cross-verification, which is deferred with the forward generator.
- Automatic demo selection is scripted and does not determine real-world suspicion.
- Generated images are synthetic hypotheses, not captured evidence or identity confirmation.
- Do not invent inference confidence, match scores, telemetry, model availability, or FPS measurements.
- The repository's original gathering/intrusion alerts are secondary to the user's core Re-ID objective.
