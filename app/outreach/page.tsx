"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Plus, Users, Mail, Eye, MousePointer, Reply, Upload, X, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

type CampaignStats = {
  total: number;
  sent: number;
  pending: number;
  opened: number;
  clicked: number;
  replied: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
};

type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: string;
  fromName: string;
  replyTo: string;
  templateHtml: string;
  templateText: string;
  createdAt: string;
  stats: CampaignStats;
};

type Contact = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  status: string;
  sentAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  repliedAt: string | null;
  openCount: number;
  clickCount: number;
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-zinc-500",
  SENDING: "text-yellow-400",
  SENT: "text-zinc-300",
  OPENED: "text-blue-400",
  CLICKED: "text-purple-400",
  REPLIED: "text-green-400",
  BOUNCED: "text-red-400",
  FAILED: "text-red-600",
  DRAFT: "text-zinc-500",
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-1">
      <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">{label}</span>
      <span className="text-3xl font-semibold">{value}</span>
      {sub && <span className="text-xs text-[var(--muted-foreground)]">{sub}</span>}
    </div>
  );
}

export default function OutreachPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New campaign form
  const [form, setForm] = useState({
    name: "",
    subject: "",
    fromName: "Rishi from Blindwall",
    replyTo: "rishi@blindwall.tech",
    templateText: "",
    templateHtml: "",
  });
  const [rawList, setRawList] = useState(""); // paste email list here
  const [creating, setCreating] = useState(false);

  const fetchCampaigns = async () => {
    const res = await fetch("/api/outreach/campaigns");
    const data = await res.json();
    setCampaigns(data);
    setLoading(false);
  };

  const fetchContacts = async (id: string) => {
    const res = await fetch(`/api/outreach/campaigns/${id}/contacts`);
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 10000);
    return () => clearInterval(interval);
  }, []);

  const selectCampaign = (c: Campaign) => {
    setSelected(c);
    fetchContacts(c.id);
  };

  const handleSend = async () => {
    if (!selected) return;
    setSending(true);
    try {
      const res = await fetch(`/api/outreach/campaigns/${selected.id}/send`, { method: "POST" });
      const data = await res.json();
      alert(`✅ Queued: ${data.sent} sent, ${data.failed} failed`);
      fetchCampaigns();
    } finally {
      setSending(false);
    }
  };

  const parseContacts = (raw: string): { email: string; name?: string; company?: string }[] => {
    return raw
      .split(/[\n,;]+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        // Support formats: email, "Name <email>", "email,name,company"
        const angleMatch = line.match(/^(.+?)\s*<(.+@.+)>$/);
        if (angleMatch) return { name: angleMatch[1].trim(), email: angleMatch[2].trim() };
        const csvMatch = line.match(/^([^,@]+@[^,]+),([^,]*),?(.*)$/);
        if (csvMatch) return { email: csvMatch[1].trim(), name: csvMatch[2].trim() || undefined, company: csvMatch[3].trim() || undefined };
        if (line.includes("@")) return { email: line };
        return null;
      })
      .filter(Boolean) as { email: string; name?: string; company?: string }[];
  };

  const handleCreate = async () => {
    if (!form.name || !form.subject || !form.templateText) return;
    setCreating(true);
    try {
      // Create campaign
      const campRes = await fetch("/api/outreach/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          templateHtml: form.templateHtml || `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;padding:32px 24px">${form.templateText.replace(/\n/g, "<br/>")}</div>`,
        }),
      });
      const camp = await campRes.json();

      // Add contacts if provided
      if (rawList.trim()) {
        const contactList = parseContacts(rawList);
        if (contactList.length > 0) {
          await fetch(`/api/outreach/campaigns/${camp.id}/contacts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contacts: contactList }),
          });
        }
      }

      setShowNew(false);
      setForm({ name: "", subject: "", fromName: "Rishi from Blindwall", replyTo: "rishi@blindwall.tech", templateText: "", templateHtml: "" });
      setRawList("");
      await fetchCampaigns();
    } finally {
      setCreating(false);
    }
  };

  const totalStats = campaigns.reduce(
    (acc, c) => ({
      total: acc.total + c.stats.total,
      sent: acc.sent + c.stats.sent,
      opened: acc.opened + c.stats.opened,
      clicked: acc.clicked + c.stats.clicked,
      replied: acc.replied + c.stats.replied,
    }),
    { total: 0, sent: 0, opened: 0, clicked: 0, replied: 0 }
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur">
        <h1 className="font-serif text-2xl tracking-tight">Outreach</h1>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-100 transition"
        >
          <Plus size={15} /> New Campaign
        </button>
      </header>

      <div className="px-8 py-8 space-y-8">
        {/* Global stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Contacts" value={totalStats.total} />
          <StatCard label="Emails Sent" value={totalStats.sent} />
          <StatCard label="Opened" value={totalStats.opened} sub={totalStats.sent > 0 ? `${Math.round((totalStats.opened / totalStats.sent) * 100)}% rate` : "—"} />
          <StatCard label="Clicked" value={totalStats.clicked} sub={totalStats.sent > 0 ? `${Math.round((totalStats.clicked / totalStats.sent) * 100)}% rate` : "—"} />
          <StatCard label="Replied" value={totalStats.replied} sub={totalStats.sent > 0 ? `${Math.round((totalStats.replied / totalStats.sent) * 100)}% rate` : "—"} />
        </div>

        {/* Campaign list */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Campaigns</h2>

          {loading ? (
            <div className="text-[var(--muted-foreground)] text-sm py-12 text-center">Loading…</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-16 text-[var(--muted-foreground)]">
              <Mail size={32} className="mx-auto mb-3 opacity-30" />
              <p>No campaigns yet. Create your first one!</p>
            </div>
          ) : (
            campaigns.map((c) => (
              <div key={c.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
                {/* Campaign row */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02] transition"
                  onClick={() => {
                    if (expandedId === c.id) {
                      setExpandedId(null);
                      setSelected(null);
                    } else {
                      setExpandedId(c.id);
                      selectCampaign(c);
                    }
                  }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {expandedId === c.id ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    <div className="min-w-0">
                      <div className="font-medium truncate">{c.name}</div>
                      <div className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">{c.subject}</div>
                    </div>
                    <span className={cn("text-xs font-medium uppercase tracking-wide ml-2", STATUS_COLOR[c.status])}>{c.status}</span>
                  </div>

                  <div className="flex items-center gap-6 text-sm shrink-0 ml-4">
                    <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                      <Users size={13} /> <span>{c.stats.total}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                      <Mail size={13} /> <span>{c.stats.sent}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <Eye size={13} /> <span>{c.stats.openRate}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-purple-400">
                      <MousePointer size={13} /> <span>{c.stats.clickRate}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-400">
                      <Reply size={13} /> <span>{c.stats.replyRate}%</span>
                    </div>
                    {c.stats.pending > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(c); handleSendCampaign(c.id); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-zinc-100 transition"
                      >
                        <Send size={12} /> Send ({c.stats.pending})
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded contacts */}
                {expandedId === c.id && (
                  <div className="border-t border-[var(--border)]">
                    {/* Template preview */}
                    <div className="px-5 py-3 border-b border-[var(--border)] bg-white/[0.02]">
                      <div className="text-xs text-[var(--muted-foreground)] mb-1 uppercase tracking-wide">Template</div>
                      <div className="text-sm text-zinc-300 whitespace-pre-wrap line-clamp-3">{c.templateText}</div>
                    </div>

                    {/* Contacts table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-[var(--muted-foreground)] border-b border-[var(--border)]">
                            <th className="text-left px-5 py-3 font-medium">Email</th>
                            <th className="text-left px-4 py-3 font-medium">Name</th>
                            <th className="text-left px-4 py-3 font-medium">Company</th>
                            <th className="text-left px-4 py-3 font-medium">Status</th>
                            <th className="text-left px-4 py-3 font-medium">Sent</th>
                            <th className="text-left px-4 py-3 font-medium">Opens</th>
                            <th className="text-left px-4 py-3 font-medium">Clicks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map((ct) => (
                            <tr key={ct.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02]">
                              <td className="px-5 py-3 font-mono text-xs">{ct.email}</td>
                              <td className="px-4 py-3 text-[var(--muted-foreground)]">{ct.name || "—"}</td>
                              <td className="px-4 py-3 text-[var(--muted-foreground)]">{ct.company || "—"}</td>
                              <td className="px-4 py-3">
                                <span className={cn("text-xs font-medium uppercase", STATUS_COLOR[ct.status])}>{ct.status}</span>
                              </td>
                              <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                                {ct.sentAt ? new Date(ct.sentAt).toLocaleDateString() : "—"}
                              </td>
                              <td className="px-4 py-3 text-xs text-blue-400">{ct.openCount || "—"}</td>
                              <td className="px-4 py-3 text-xs text-purple-400">{ct.clickCount || "—"}</td>
                            </tr>
                          ))}
                          {contacts.length === 0 && (
                            <tr>
                              <td colSpan={7} className="px-5 py-8 text-center text-[var(--muted-foreground)]">No contacts yet</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Campaign Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="font-serif text-xl">New Campaign</h2>
              <button onClick={() => setShowNew(false)} className="text-[var(--muted-foreground)] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">Campaign Name *</label>
                  <input
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Q2 Cold Outreach"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">Subject *</label>
                  <input
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Quick question about your security"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">From Name</label>
                  <input
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20"
                    value={form.fromName}
                    onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">Reply-To</label>
                  <input
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20"
                    value={form.replyTo}
                    onChange={(e) => setForm({ ...form, replyTo: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">Email Body (Plain Text) *</label>
                <textarea
                  rows={8}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 font-mono resize-none"
                  value={form.templateText}
                  onChange={(e) => setForm({ ...form, templateText: e.target.value })}
                  placeholder={`Hi there,\n\nI noticed your company and wanted to reach out...\n\nBest,\nRishi`}
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">
                  Contact List — paste emails, one per line
                  <span className="ml-2 text-zinc-600 normal-case">Supports: email, Name &lt;email&gt;, email,name,company</span>
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 font-mono resize-none"
                  value={rawList}
                  onChange={(e) => setRawList(e.target.value)}
                  placeholder={`john@acme.com\nJane Doe <jane@startup.io>\nbob@corp.com,Bob Smith,BigCorp`}
                />
                {rawList.trim() && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {parseContacts(rawList).length} contacts parsed
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => setShowNew(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !form.name || !form.subject || !form.templateText}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-100 transition disabled:opacity-40"
              >
                {creating ? "Creating…" : "Create Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  async function handleSendCampaign(id: string) {
    setSending(true);
    try {
      const res = await fetch(`/api/outreach/campaigns/${id}/send`, { method: "POST" });
      const data = await res.json();
      alert(`✅ ${data.sent} sent, ${data.failed} failed`);
      await fetchCampaigns();
    } finally {
      setSending(false);
    }
  }
}
