import {
  CaretRight,
  ChatCircleText,
  Check,
  CircleDashed,
  Clock,
  FileText,
  House,
  UsersThree,
  Headset,
} from "@phosphor-icons/react/ssr";
import { workspace, type StageId } from "@/content/site";
import { cn } from "@/lib/cn";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { LogoMark } from "@/components/ui/Logo";

const ORDER: StageId[] = ["share", "assess", "complete", "track"];
const SIDEBAR_ICONS = [House, UsersThree, FileText, Headset];

type Item = { label: string; state: "done" | "pending"; note: string };
type Row = { label: string; value: string };

/**
 * Illustrative payment workspace. One component, four states, driven by the
 * selected stage in "How it works". Not interactive, clearly labelled.
 */
export function WorkspacePreview({ stage, className }: { stage: StageId; className?: string }) {
  const data = workspace.stages[stage];
  const stageIndex = ORDER.indexOf(stage);
  const rows: ReadonlyArray<Row> = "rows" in data ? data.rows : [];
  const checklist: ReadonlyArray<Item> = "checklist" in data ? data.checklist : [];

  return (
    <figure className={cn("overflow-hidden rounded-frame border border-line bg-surface shadow-float", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-sunken px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 text-small">
          <LogoMark size={22} />
          <span className="font-semibold text-fg">{workspace.breadcrumb[0]}</span>
          <CaretRight size={12} weight="bold" className="shrink-0 text-fg-subtle" aria-hidden="true" />
          <span className="truncate text-fg-muted">{workspace.breadcrumb[1]}</span>
        </div>
        <Badge variant="illustrative" size="sm">
          Illustrative
        </Badge>
      </div>

      <div className="grid md:grid-cols-[10rem_minmax(0,1fr)]">
        <div className="hidden border-r border-line p-3 md:block" aria-hidden="true">
          <ul className="flex flex-col gap-1">
            {workspace.sidebar.map((label, index) => {
              const Icon = SIDEBAR_ICONS[index];
              return (
                <li
                  key={label}
                  className={cn(
                    "flex items-center gap-2 rounded-sm px-2.5 py-2 text-small",
                    index === 0 ? "bg-accent-soft font-semibold text-accent" : "text-fg-muted",
                  )}
                >
                  <Icon size={16} />
                  {label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-micro font-semibold text-fg-subtle">{workspace.corridor}</p>
              <p className="text-lead font-semibold text-fg">{workspace.title}</p>
            </div>
            <Badge variant={data.status.tone as BadgeVariant}>{data.status.label}</Badge>
          </div>

          <ol className="mt-5 grid grid-cols-4 gap-1.5" aria-label="Payment progress">
            {workspace.track.map((label, index) => {
              const done = index < stageIndex || (stage === "track" && index === stageIndex);
              const current = index === stageIndex && !done;
              return (
                <li key={label} className="min-w-0">
                  <span
                    className={cn(
                      "block h-1 rounded-pill",
                      done ? "bg-action" : current ? "bg-strait-300" : "bg-line",
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "sr-only mt-2 items-center gap-1 text-micro sm:not-sr-only sm:flex",
                      done || current ? "font-semibold text-fg" : "text-fg-subtle",
                    )}
                  >
                    {done ? <Check size={12} weight="bold" className="shrink-0 text-accent" aria-hidden="true" /> : null}
                    <span className="truncate">{label}</span>
                    <span className="sr-only">{done ? ", complete" : current ? ", current" : ", upcoming"}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          {/* Phones: four labels do not fit, so name the current step once. */}
          <p className="mt-2 flex items-center gap-1 text-micro font-semibold text-fg sm:hidden" aria-hidden="true">
            {stage === "track" ? <Check size={12} weight="bold" className="text-accent" /> : null}
            {workspace.track[stageIndex]}
            <span className="font-normal text-fg-subtle">
              {stageIndex + 1} of {workspace.track.length}
            </span>
          </p>

          <div className="mt-6 min-h-44">
            <p className="text-small font-semibold text-fg">{data.heading}</p>
            {rows.length > 0 ? (
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="min-w-0 rounded-control border border-line px-3.5 py-2.5 sm:last:odd:col-span-2"
                  >
                    <dt className="text-micro text-fg-subtle">{row.label}</dt>
                    <dd className="truncate text-small font-semibold text-fg tabular-nums">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {checklist.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2">
                {checklist.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-3 rounded-control border border-line px-3.5 py-2.5"
                  >
                    <span className="flex min-w-0 items-center gap-2.5 text-small font-medium text-fg">
                      {item.state === "done" ? (
                        <Check size={16} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
                      ) : (
                        <CircleDashed size={16} weight="bold" className="shrink-0 text-pending-fg" aria-hidden="true" />
                      )}
                      <span className="min-w-0">{item.label}</span>
                    </span>
                    <span
                      className={cn(
                        "flex shrink-0 items-center gap-1 text-micro font-semibold",
                        item.state === "done" ? "text-fg-muted" : "text-pending-fg",
                      )}
                    >
                      {item.state === "pending" ? <Clock size={12} weight="bold" aria-hidden="true" /> : null}
                      {item.note}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-control bg-surface-sunken px-3.5 py-3">
            <span className="flex min-w-0 items-center gap-2.5 text-small text-fg">
              <ChatCircleText size={18} className="shrink-0 text-accent" aria-hidden="true" />
              <span className="min-w-0">{workspace.manager.label}</span>
            </span>
            <span className="shrink-0 rounded-sm border border-line bg-surface px-2.5 py-1 text-micro font-semibold text-fg" aria-hidden="true">
              {workspace.manager.action}
            </span>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">{workspace.caption}</figcaption>
    </figure>
  );
}
