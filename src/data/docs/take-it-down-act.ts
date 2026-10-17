import type { Doc } from "./types";

/**
 * "Take It Down Act (TIDA)" — Trust & Policies doc.
 *
 * Federal law requiring online platforms to remove nonconsensual intimate
 * imagery and digital deepfakes within 48 hours of a valid request. Enforced
 * by the FTC; active compliance and enforcement window began May 2026.
 *
 * Placement: /privacy-and-safety/take-it-down-act — surfaced as a top-level
 * child of Trust & Policies (alongside Safety & Security and the
 * Transparency Center). The footer "US TIDA" link points here.
 */
export const takeItDownActDoc: Doc = {
  path: "/privacy-and-safety/take-it-down-act",
  blocks: [
    {
      type: "paragraph",
      text: "The Take It Down Act (TIDA) is a federal law that requires online platforms to remove nonconsensual intimate imagery and digital deepfakes within 48 hours of a valid request. Enforced by the Federal Trade Commission (FTC), the active compliance and enforcement window began in May 2026.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "If you are in immediate danger",
      text: "If you are at risk of immediate harm, contact local emergency services first. TIDA reporting is for content removal and does not replace emergency response.",
    },

    { type: "heading", text: "What TIDA covers" },
    {
      type: "paragraph",
      text: "TIDA applies to nonconsensual intimate imagery (NCII) and digitally altered intimate imagery (deepfakes) shared without the depicted person's consent. Musicosy is required by law to act on valid removal requests within 48 hours of receiving them.",
    },

    { type: "heading", text: "Key TIDA requirements" },
    {
      type: "list",
      items: [
        {
          lead: "Fast Removal:",
          text: "Platforms must take down reported content and known duplicates within 48 hours of a valid request.",
        },
        {
          lead: "Easy Reporting:",
          text: "Services must offer a clear, plain-language notice and submission process directly where content appears.",
        },
        {
          lead: "Tracking:",
          text: "Companies must provide request tracking numbers and status updates to victims.",
        },
        {
          lead: "Heavy Penalties:",
          text: "Violations can result in federal civil penalties exceeding $53,000 per violation.",
        },
      ],
    },

    { type: "heading", text: "How to report on Musicosy" },
    {
      type: "paragraph",
      text: "You can report nonconsensual intimate imagery or deepfakes directly from the content where it appears — on a post, profile, Note, Live Session, or Backstage message. TIDA requires the reporting option to be available on the content surface itself.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        { text: "Open the post, profile, Note, or message containing the content." },
        { text: "Select the More options menu." },
        {
          text: "Choose Report, then select 'Nonconsensual intimate imagery' or 'Deepfake / synthetic intimate imagery'.",
        },
        {
          text: "Confirm whether you are the person depicted or reporting on someone's behalf.",
        },
        { text: "Submit. You will immediately receive a tracking number." },
      ],
    },
    {
      type: "callout",
      variant: "note",
      title: "Can't find the report option?",
      text: "TIDA requires the reporting option to be available directly on the content surface. If you cannot find the report option on a specific piece of content, contact support immediately.",
    },

    { type: "heading", text: "Tracking your removal request" },
    {
      type: "paragraph",
      text: "Every TIDA report is assigned a tracking number. Use it to check status and receive updates as Musicosy processes the removal.",
    },
    {
      type: "list",
      items: [
        { text: "A tracking number is issued at the moment you submit the report." },
        { text: "Status updates are sent as the request is reviewed, actioned, and closed." },
        { text: "You can view your report history and current status from your Safety Settings." },
      ],
    },

    { type: "heading", text: "Removal within 48 hours" },
    {
      type: "paragraph",
      text: "Once a valid request is received, Musicosy removes the reported content and known duplicates within 48 hours. 'Known duplicates' are copies the platform can reasonably identify — including reposts, resings, and re-uploads of the same material.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Reporting duplicates",
      text: "Each known duplicate starts its own 48-hour clock from the time it is identified or reported. If you become aware of a duplicate that was not automatically removed, report it.",
    },

    { type: "heading", text: "Enforcement and penalties" },
    {
      type: "paragraph",
      text: "TIDA is enforced by the Federal Trade Commission. Violations — such as failing to remove content within 48 hours, failing to provide a tracking mechanism, or failing to offer an accessible reporting process — can result in federal civil penalties exceeding $53,000 per violation.",
    },

    { type: "heading", text: "Related protections on Musicosy" },
    {
      type: "paragraph",
      text: "TIDA works alongside Musicosy's existing safety controls. In addition to filing a TIDA removal request, you can Block and Mute the accounts involved, and Flag the behavior for Trust & Safety review under our Community Guidelines.",
    },
  ],
  related: [
    "/support/reports-and-appeals/report-a-post-account-live-comment-dm",
    "/privacy-and-safety/safety-and-security",
    "/resources/help-center/using-musicosy/content-interaction/block-and-mute",
    "/privacy-and-safety/content-and-conduct/community-guidelines",
  ],
};
