"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, Button, FormField } from "@/components/ads/ui";

/* ═══════════════════════════════════════════════════════════
   Getting Started feature — /ads/getting-started

   Layout (3-column, inside the existing dashboard shell):
     [dashboard sidebar] | [step tree navigator] | [step content]

   The step tree navigator mirrors the exact tree the user specified:

     Getting Started
     ├── What describes your intent?
     │   ├── I want to work with artists
     │   └── I want to grow my business
     ├── Advertiser or Agency?
     ├── Business Information
     │   ├── Business name
     │   ├── Industry
     │   ├── Country / Region
     │   └── Website
     ├── Advertiser Account Information
     │   ├── Account name
     │   ├── Time zone
     │   └── Currency
     ├── Business Verification
     │   ├── Start verification
     │   ├── Verify business to engage creators
     │   ├── Review analytics
     │   └── Make payments to creators
     └── Invite Members
         ├── Active
         ├── Pending
         ├── Removed
         └── Search members
   ═══════════════════════════════════════════════════════════ */

type Intent = "artists" | "business" | "";
type AccountType = "advertiser" | "agency" | "";
type MemberStatus = "active" | "pending" | "removed";
type MemberFilter = "all" | MemberStatus;

interface Member {
  email: string;
  status: MemberStatus;
  role: string;
}

interface StepDef {
  id: number;
  label: string;
  children?: string[];
}

const STEPS: StepDef[] = [
  {
    id: 0,
    label: "What describes your intent?",
    children: ["I want to work with artists", "I want to grow my business"],
  },
  { id: 1, label: "Advertiser or Agency?" },
  {
    id: 2,
    label: "Business Information",
    children: ["Business name", "Industry", "Country / Region", "Website"],
  },
  {
    id: 3,
    label: "Advertiser Account Information",
    children: ["Account name", "Time zone", "Currency"],
  },
  {
    id: 4,
    label: "Business Verification",
    children: [
      "Start verification",
      "Verify business to engage creators",
      "Review analytics",
      "Make payments to creators",
    ],
  },
  {
    id: 5,
    label: "Invite Members",
    children: ["Active", "Pending", "Removed", "Search members"],
  },
];

export default function GettingStartedPage() {
  const [step, setStep] = useState(0);

  // Step 1 — Intent
  const [intent, setIntent] = useState<Intent>("");
  // Step 2 — Advertiser or Agency
  const [accountType, setAccountType] = useState<AccountType>("");
  // Step 3 — Business Information
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  // Step 4 — Advertiser Account Information
  const [accountName, setAccountName] = useState("");
  const [timezone, setTimezone] = useState("America/Chicago");
  const [currency, setCurrency] = useState("USD");
  // Step 5 — Business Verification
  const [verifyCreators, setVerifyCreators] = useState(false);
  const [verifyAnalytics, setVerifyAnalytics] = useState(false);
  const [verifyPayments, setVerifyPayments] = useState(false);
  const [verificationStarted, setVerificationStarted] = useState(false);
  // Step 6 — Invite Members
  const [members, setMembers] = useState<Member[]>([
    { email: "you@company.com", status: "active", role: "Admin" },
    { email: "alex@company.com", status: "pending", role: "Editor" },
    { email: "jordan@company.com", status: "active", role: "Viewer" },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Editor");
  const [memberFilter, setMemberFilter] = useState<MemberFilter>("all");
  const [memberSearch, setMemberSearch] = useState("");

  function addMember() {
    const email = inviteEmail.trim();
    if (!email || members.find((m) => m.email === email)) return;
    setMembers([...members, { email, status: "pending", role: inviteRole }]);
    setInviteEmail("");
  }
  function removeMember(email: string) {
    setMembers(
      members.map((m) => (m.email === email ? { ...m, status: "removed" } : m))
    );
  }
  const filteredMembers = members
    .filter((m) => memberFilter === "all" || m.status === memberFilter)
    .filter(
      (m) =>
        !memberSearch ||
        m.email.toLowerCase().includes(memberSearch.toLowerCase())
    );

  // Each step can require a choice/field before Continue unlocks.
  const canContinue =
    step === 0
      ? intent !== ""
      : step === 1
        ? accountType !== ""
        : step === 2
          ? businessName.trim() !== "" && industry !== "" && country !== ""
          : step === 3
            ? accountName.trim() !== ""
            : true;

  return (
    <div className="flex h-full gap-6">
      {/* ════════════ Step tree navigator (left) ════════════ */}
      <aside className="hidden w-72 shrink-0 flex-col rounded-xl border border-neutral-100 bg-white lg:flex">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">
            Getting Started
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Set up your advertising account in {STEPS.length} steps.
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {STEPS.map((s) => {
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <div key={s.id} className="mb-0.5">
                <button
                  onClick={() => setStep(s.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                    isActive
                      ? "bg-neutral-900 font-medium text-white"
                      : isDone
                        ? "text-neutral-900 hover:bg-neutral-50"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {isDone ? (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      s.id + 1
                    )}
                  </span>
                  <span className="flex-1">{s.label}</span>
                </button>
                {/* Sub-items: render when this step is active OR done */}
                {(isActive || isDone) && s.children && (
                  <div className="ml-[22px] border-l border-neutral-100 py-1 pl-3">
                    {s.children.map((child) => (
                      <div
                        key={child}
                        className="rounded-md px-2 py-1 text-[12px] text-neutral-500"
                      >
                        {child}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="border-t border-neutral-100 px-5 py-3">
          <Link
            href="/ads/dashboard"
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            Skip setup →
          </Link>
        </div>
      </aside>

      {/* ════════════ Step content (right) ════════════ */}
      <div className="min-w-0 flex-1">
        <PageHeader
          title="Getting Started"
          description={`Step ${step + 1} of ${STEPS.length} — ${STEPS[step].label}`}
          breadcrumbs={[
            { label: "Ad Center", href: "/ads" },
            { label: "Getting Started" },
          ]}
        />

        <div className="rounded-xl border border-neutral-100 bg-white p-6 lg:p-8">
          {/* ─── Step 1: What describes your intent? ─── */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  What describes your intent?
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Choose the option that best describes why you are setting up
                  this account.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setIntent("artists")}
                  className={`rounded-xl border-2 p-6 text-left transition-all ${
                    intent === "artists"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-100 hover:border-neutral-200"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-neutral-900">
                    I want to work with artists
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    Collaborate with creators, manage partnerships, and build
                    artist relationships.
                  </p>
                </button>
                <button
                  onClick={() => setIntent("business")}
                  className={`rounded-xl border-2 p-6 text-left transition-all ${
                    intent === "business"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-100 hover:border-neutral-200"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M3 3v18h18" />
                      <path d="M7 16l4-4 4 4 5-5" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-neutral-900">
                    I want to grow my business
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    Run advertising campaigns, reach new customers, and drive
                    sales.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 2: Advertiser or Agency? ─── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Advertiser or Agency?
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Select how you will use this advertising account.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setAccountType("advertiser")}
                  className={`rounded-xl border-2 p-6 text-left transition-all ${
                    accountType === "advertiser"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-100 hover:border-neutral-200"
                  }`}
                >
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Advertiser
                  </h3>
                  <p className="mt-2 text-xs text-neutral-500">
                    Run ads for your own business. You manage campaigns,
                    creatives, and billing directly.
                  </p>
                </button>
                <button
                  onClick={() => setAccountType("agency")}
                  className={`rounded-xl border-2 p-6 text-left transition-all ${
                    accountType === "agency"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-100 hover:border-neutral-200"
                  }`}
                >
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Agency
                  </h3>
                  <p className="mt-2 text-xs text-neutral-500">
                    Manage ads for multiple clients. Access cross-client
                    reporting and agency billing features.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Business Information ─── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Business Information
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Tell us about your business so we can tailor your advertising
                  experience.
                </p>
              </div>
              <FormField label="Business name">
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your company name"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
              </FormField>
              <FormField label="Industry">
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-neutral-400 focus:outline-none"
                >
                  <option value="">Select industry…</option>
                  <option>Music &amp; Entertainment</option>
                  <option>Technology</option>
                  <option>Retail &amp; E-commerce</option>
                  <option>Financial Services</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Food &amp; Beverage</option>
                  <option>Fashion &amp; Beauty</option>
                  <option>Travel &amp; Hospitality</option>
                  <option>Other</option>
                </select>
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Country / Region">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-neutral-400 focus:outline-none"
                  >
                    <option value="">Select country…</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Japan</option>
                    <option>Brazil</option>
                    <option>India</option>
                    <option>Other</option>
                  </select>
                </FormField>
                <FormField label="Website">
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* ─── Step 4: Advertiser Account Information ─── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Advertiser Account Information
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Set up your advertiser account defaults. These can be changed
                  later in account settings.
                </p>
              </div>
              <FormField label="Account name">
                <input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder={businessName || "My Ad Account"}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Time zone">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-neutral-400 focus:outline-none"
                  >
                    <option value="America/New_York">
                      Eastern Time (US &amp; Canada)
                    </option>
                    <option value="America/Chicago">
                      Central Time (US &amp; Canada)
                    </option>
                    <option value="America/Denver">
                      Mountain Time (US &amp; Canada)
                    </option>
                    <option value="America/Los_Angeles">
                      Pacific Time (US &amp; Canada)
                    </option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Berlin">Central European Time</option>
                    <option value="Asia/Tokyo">Japan (JST)</option>
                    <option value="Australia/Sydney">Sydney (AEST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </FormField>
                <FormField label="Currency">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-neutral-400 focus:outline-none"
                  >
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                    <option value="CAD">CAD — Canadian Dollar</option>
                    <option value="AUD">AUD — Australian Dollar</option>
                    <option value="JPY">JPY — Japanese Yen</option>
                    <option value="BRL">BRL — Brazilian Real</option>
                    <option value="INR">INR — Indian Rupee</option>
                  </select>
                </FormField>
              </div>
            </div>
          )}

          {/* ─── Step 5: Business Verification ─── */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Business Verification
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Verify your business to unlock full platform capabilities. You
                  can complete verification now or skip and do it later from
                  account settings.
                </p>
              </div>

              {/* Start verification CTA */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Start verification
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      Submit your business documents for verification.
                      Typically takes 1–3 business days.
                    </p>
                  </div>
                  {verificationStarted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Submitted
                    </span>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => setVerificationStarted(true)}
                    >
                      Start verification
                    </Button>
                  )}
                </div>
              </div>

              {/* Verification capabilities */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Verify business to:
                </p>

                <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-neutral-100 p-4">
                  <input
                    type="checkbox"
                    checked={verifyCreators}
                    onChange={(e) => setVerifyCreators(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900">
                      Engage creators
                    </h4>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Required to collaborate with creators through Creative
                      Partnerships and manage direct creator relationships.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-neutral-100 p-4">
                  <input
                    type="checkbox"
                    checked={verifyAnalytics}
                    onChange={(e) => setVerifyAnalytics(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900">
                      Review analytics
                    </h4>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Required to access detailed audience insights, attribution
                      analytics, and third-party measurement data.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-neutral-100 p-4">
                  <input
                    type="checkbox"
                    checked={verifyPayments}
                    onChange={(e) => setVerifyPayments(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900">
                      Make payments to creators
                    </h4>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Required to process payments to creators for
                      collaborations, sponsorships, and partnership agreements.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* ─── Step 6: Invite Members ─── */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Invite Members
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Add team members to help manage your advertising account. You
                  can assign roles and permissions later.
                </p>
              </div>

              {/* Invite row */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email to invite…"
                  className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-neutral-400 focus:outline-none"
                >
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
                <Button onClick={addMember} disabled={!inviteEmail.trim()}>
                  Invite member
                </Button>
              </div>

              {/* Filter tabs: Active / Pending / Removed / All */}
              <div className="flex gap-1 border-b border-neutral-200">
                {(
                  ["all", "active", "pending", "removed"] as MemberFilter[]
                ).map((f) => (
                  <button
                    key={f}
                    onClick={() => setMemberFilter(f)}
                    className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                      memberFilter === f
                        ? "border-b-2 border-neutral-900 text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    {f} (
                    {members.filter((m) => f === "all" || m.status === f).length}
                    )
                  </button>
                ))}
              </div>

              {/* Search members */}
              <div className="relative">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search members…"
                  className="w-full rounded-lg border border-neutral-200 py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
              </div>

              {/* Member list */}
              <div className="space-y-1.5">
                {filteredMembers.length === 0 && (
                  <div className="rounded-lg border border-neutral-100 p-4 text-center text-sm text-neutral-400">
                    No members found
                  </div>
                )}
                {filteredMembers.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center justify-between rounded-lg border border-neutral-100 px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
                        {member.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-neutral-900">
                          {member.email}
                        </p>
                        <p className="text-xs capitalize text-neutral-500">
                          {member.status} · {member.role}
                        </p>
                      </div>
                    </div>
                    {member.status !== "removed" &&
                      member.email !== "you@company.com" && (
                        <button
                          onClick={() => removeMember(member.email)}
                          className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    {member.status === "removed" && (
                      <span className="text-xs text-neutral-400">Removed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation footer */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <div className="flex items-center gap-3">
            {step < STEPS.length - 1 ? (
              <>
                <Link
                  href="/ads/dashboard"
                  className="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Skip for now
                </Link>
                <Button
                  onClick={() =>
                    setStep(Math.min(STEPS.length - 1, step + 1))
                  }
                  disabled={!canContinue}
                >
                  Continue
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = "/ads/dashboard")}
              >
                Complete setup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
