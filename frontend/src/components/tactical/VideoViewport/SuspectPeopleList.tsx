import { SUSPECT_PICKER, VIDEO_TESTING } from "@/constants/tactical";
import type { SuspectPeopleListProps } from "@/types";

export function SuspectPeopleList({ detections, pending, onSelect }: SuspectPeopleListProps) {
  return (
    <div className="flex flex-col gap-2">
      <span id="people-in-view" className={SUSPECT_PICKER.peopleLabelClass}>People in view</span>
      {detections.length === 0 ? (
        <p className={SUSPECT_PICKER.emptyClass}>No one is in view yet.</p>
      ) : (
        <div role="group" aria-labelledby="people-in-view" className={SUSPECT_PICKER.peopleRowClass}>
          {detections.slice(0, VIDEO_TESTING.quickSelectLimit).map(person => (
            <button
              key={person.id}
              type="button"
              disabled={pending}
              onClick={() => onSelect(person.id)}
              className={SUSPECT_PICKER.personButtonClass}
              aria-label={`Choose person ${person.id} as suspect`}
            >
              Person {person.id}
              <span className={SUSPECT_PICKER.personConfidenceClass}>{Math.round((person.conf ?? 0) * 100)}%</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
