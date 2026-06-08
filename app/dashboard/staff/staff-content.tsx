'use client';

import { useState, useCallback } from 'react';
import { useFetch } from '@/hooks/use-fetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Phone, Mail, Plus, X, UserCheck, UserX, Wrench, Building2, Star, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export function StaffContent() {
  const { data: session } = useSession() || {};
  const { data: staff, loading, refetch } = useFetch('/api/staff', []);
  const { data: agencies, refetch: refetchAgencies } = useFetch('/api/agencies', []);
  const { data: machines } = useFetch('/api/machines', []);
  const { t } = useI18n();
  const role = session?.user?.role;
  const canManage = role === 'TEAM_LEADER' || role === 'PLANT_DIRECTOR';
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddAgency, setShowAddAgency] = useState(false);
  const [expandedStaff, setExpandedStaff] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [staffForm, setStaffForm] = useState({ name: '', email: '', role: 'OPERATOR', phone: '', password: '', agencyId: '', position: '', skills: '' });
  const [agencyForm, setAgencyForm] = useState({ name: '', contactName: '', contactEmail: '', contactPhone: '', address: '', notes: '' });
  const [assignForm, setAssignForm] = useState({});
  const [ratingForm, setRatingForm] = useState({});
  const [incidentForm, setIncidentForm] = useState({});

  const filteredStaff = staff?.filter(s => {
    if (activeTab === 'all') return true;
    if (activeTab === 'operators') return s.role === 'OPERATOR';
    if (activeTab === 'leaders') return s.role === 'TEAM_LEADER';
    if (activeTab === 'mechanics') return s.role === 'MECHANIC';
    if (activeTab === 'agencies') return false;
    return true;
  }) ?? [];

  const onAgencyFieldChange = useCallback((field) => {
    return function(e) { setAgencyForm(prev => ({...prev, [field]: e.target.value})); };
  }, []);

  const onStaffFieldChange = useCallback((field) => {
    return function(e) { setStaffForm(prev => ({...prev, [field]: e.target.value})); };
  }, []);

  const onSelectChange = useCallback((setter) => {
    return function(e) { setter(prev => ({...prev, [e.target.name]: e.target.value})); };
  }, []);
  function handleAgencyNameChange(e) { setAgencyForm(prev => ({...prev, name: e.target.value})); }
  function handleAgencyContactChange(e) { setAgencyForm(prev => ({...prev, contactName: e.target.value})); }
  function handleAgencyEmailChange(e) { setAgencyForm(prev => ({...prev, contactEmail: e.target.value})); }
  function handleAgencyPhoneChange(e) { setAgencyForm(prev => ({...prev, contactPhone: e.target.value})); }
  function handleAgencyNotesChange(e) { setAgencyForm(prev => ({...prev, notes: e.target.value})); }

  function handleStaffNameChange(e) { setStaffForm(prev => ({...prev, name: e.target.value})); }
  function handleStaffEmailChange(e) { setStaffForm(prev => ({...prev, email: e.target.value})); }
  function handleStaffPhoneChange(e) { setStaffForm(prev => ({...prev, phone: e.target.value})); }
  function handleStaffPassChange(e) { setStaffForm(prev => ({...prev, password: e.target.value})); }
  function handleStaffPosChange(e) { setStaffForm(prev => ({...prev, position: e.target.value})); }
  function handleStaffSkillChange(e) { setStaffForm(prev => ({...prev, skills: e.target.value})); }
  function handleStaffRoleChange(e) { setStaffForm(prev => ({...prev, role: e.target.value})); }
  function handleStaffAgencyChange(e) { setStaffForm(prev => ({...prev, agencyId: e.target.value})); }

  function toggleAgencyForm() { setShowAddAgency(function(v) { return !v; }); }
  function toggleStaffForm() { setShowAddStaff(function(v) { return !v; }); }
  function hideAgencyForm() { setShowAddAgency(false); }
  function hideStaffForm() { setShowAddStaff(false); }

  const handleAddStaff = async function(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/staff', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(staffForm) });
      if (!res.ok) { const d = await res.json().catch(function() { return {}; }); throw new Error(d.error || "Error"); }
      toast.success(t("staff.addedSuccess"));
      setShowAddStaff(false);
      setStaffForm({ name: "", email: "", role: "OPERATOR", phone: "", password: "", agencyId: "", position: "", skills: "" });
      refetch();
    } catch (err) { toast.error(err.message); }
  };

  const handleAddAgency = async function(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/agencies', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(agencyForm) });
      if (!res.ok) { const d = await res.json().catch(function() { return {}; }); throw new Error(d.error || "Error"); }
      toast.success(t("staff.addAgency"));
      setShowAddAgency(false);
      setAgencyForm({ name: "", contactName: "", contactEmail: "", contactPhone: "", address: "", notes: "" });
      refetchAgencies();
    } catch (err) { toast.error(err.message); }
  };

  const toggleActive = async function(id, isActive) {
    try {
      await fetch('/api/staff', { method: 'PATCH', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: id, isActive: !isActive }) });
      toast.success(isActive ? t("staff.deactivated") : t("staff.activated"));
      refetch();
    } catch { toast.error(t("common.error")); }
  };

  const handleAssign = async function(userId) {
    const form = assignForm[userId];
    if (!form || !form.machineId || !form.shift) return;
    try {
      await fetch('/api/staff', { method: 'PUT', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: userId, machineId: form.machineId, shift: form.shift }) });
      toast.success(t("staff.assignedTo"));
      refetch();
    } catch { toast.error(t("common.error")); }
  };

  const handleAddRating = async function(userId) {
    const form = ratingForm[userId];
    if (!form || !form.score) return;
    try {
      await fetch('/api/staff/ratings', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: userId, score: form.score, strengths: form.strengths, notes: form.notes }) });
      toast.success(t("staff.ratingAdded"));
      setRatingForm(function(prev) { var r = {}; r[userId] = { score: 0, strengths: "", notes: "" }; return {...prev, ...r}; });
      refetch();
    } catch { toast.error(t("common.error")); }
  };
  const handleAddIncident = async function(userId) {
    const form = incidentForm[userId];
    if (!form || !form.title || !form.description) return;
    try {
      const res = await fetch('/api/staff/incidents', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: userId, title: form.title, description: form.description, severity: form.severity }) });
      if (!res.ok) throw new Error("Failed");
      toast.success(t("staff.incidentAdded"));
      setIncidentForm(function(prev) { var r = {}; r[userId] = { title: "", description: "", severity: "MEDIUM" }; return {...prev, ...r}; });
      refetch();
    } catch { toast.error(t("common.error")); }
  };

  const resolveIncident = async function(incidentId) {
    try {
      await fetch('/api/staff/incidents', { method: 'PATCH', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: incidentId, resolved: true, resolution: "Resolved by team leader" }) });
      toast.success(t("staff.incidentResolved"));
      refetch();
    } catch { toast.error(t("common.error")); }
  };

  const avgRating = function(ratings) {
    if (!ratings || !ratings.length) return 0;
    return (ratings.reduce(function(sum, r) { return sum + r.score; }, 0) / ratings.length).toFixed(1);
  };

  function handleAssignMachineChange(userId, e) {
    var val = e.target.value;
    setAssignForm(function(prev) {
      var cur = prev[userId] || {};
      var r = {};
      r[userId] = { machineId: val, shift: cur.shift || "MORNING" };
      return {...prev, ...r};
    });
  }

  function handleAssignShiftChange(userId, e) {
    var val = e.target.value;
    setAssignForm(function(prev) {
      var cur = prev[userId] || {};
      var r = {};
      r[userId] = { machineId: cur.machineId || "", shift: val };
      return {...prev, ...r};
    });
  }

  function handleRatingClick(personId, score) {
    setRatingForm(function(prev) {
      var cur = prev[personId] || {};
      var r = {};
      r[personId] = { score: score, strengths: cur.strengths || "", notes: cur.notes || "" };
      return {...prev, ...r};
    });
  }

  function handleRatingStrengthChange(personId, e) {
    var val = e.target.value;
    setRatingForm(function(prev) {
      var cur = prev[personId] || {};
      var r = {};
      r[personId] = { score: cur.score || 0, strengths: val, notes: cur.notes || "" };
      return {...prev, ...r};
    });
  }

  function handleRatingNotesChange(personId, e) {
    var val = e.target.value;
    setRatingForm(function(prev) {
      var cur = prev[personId] || {};
      var r = {};
      r[personId] = { score: cur.score || 0, strengths: cur.strengths || "", notes: val };
      return {...prev, ...r};
    });
  }

  function handleIncidentTitleChange(personId, e) {
    var val = e.target.value;
    setIncidentForm(function(prev) {
      var cur = prev[personId] || {};
      var r = {};
      r[personId] = { title: val, description: cur.description || "", severity: cur.severity || "MEDIUM" };
      return {...prev, ...r};
    });
  }

  function handleIncidentDescChange(personId, e) {
    var val = e.target.value;
    setIncidentForm(function(prev) {
      var cur = prev[personId] || {};
      var r = {};
      r[personId] = { title: cur.title || "", description: val, severity: cur.severity || "MEDIUM" };
      return {...prev, ...r};
    });
  }

  function handleIncidentSeverityChange(personId, e) {
    var val = e.target.value;
    setIncidentForm(function(prev) {
      var cur = prev[personId] || {};
      var r = {};
      r[personId] = { title: cur.title || "", description: cur.description || "", severity: val };
      return {...prev, ...r};
    });
  }
  if (loading) return <div className="space-y-4">{[1,2,3].map(function(i) { return <Skeleton key={i} className="h-20 rounded-lg" />; })}</div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#004B87] dark:text-blue-300 flex items-center gap-2"><Users className="h-6 w-6" />{t("staff.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("staff.desc")}</p>
        </div>
        <div className="flex gap-2">
          {canManage && (<><Button variant="outline" onClick={toggleAgencyForm}><Building2 className="h-4 w-4 mr-2" /> {t("staff.addAgency")}</Button>
            <Button onClick={toggleStaffForm} className="bg-[#005A9E] hover:bg-[#004B87]"><Plus className="h-4 w-4 mr-2" /> {t("staff.addStaff")}</Button></>)}
        </div>
      </div>

      {showAddAgency && canManage && (
        <Card className="border-2 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between"><Building2 className="h-5 w-5 text-purple-600" /> {t("staff.addAgency")}<Button variant="ghost" size="sm" onClick={hideAgencyForm}><X className="h-4 w-4" /></Button></CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAgency} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>{t("staff.agencyName")} *</Label><Input value={agencyForm.name} onChange={handleAgencyNameChange} required /></div>
              <div><Label>{t("staff.contactName")}</Label><Input value={agencyForm.contactName} onChange={handleAgencyContactChange} /></div>
              <div><Label>{t("staff.contactEmail")}</Label><Input type="email" value={agencyForm.contactEmail} onChange={handleAgencyEmailChange} /></div>
              <div><Label>{t("staff.contactPhone")}</Label><Input value={agencyForm.contactPhone} onChange={handleAgencyPhoneChange} /></div>
              <div><Label>{t("staff.notes")}</Label><Input value={agencyForm.notes} onChange={handleAgencyNotesChange} /></div>
              <div className="md:col-span-2"><Button type="submit" className="bg-purple-600 hover:bg-purple-700">{t("common.save")}</Button></div>
            </form>
          </CardContent>
        </Card>
      )}

      {showAddStaff && canManage && (
        <Card className="border-2 border-[#005A9E]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">{t("staff.addStaff")}<Button variant="ghost" size="sm" onClick={hideStaffForm}><X className="h-4 w-4" /></Button></CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>{t("staff.name")} *</Label><Input value={staffForm.name} onChange={handleStaffNameChange} required /></div>
              <div><Label>{t("staff.email")} *</Label><Input type="email" value={staffForm.email} onChange={handleStaffEmailChange} required /></div>
              <div><Label>{t("staff.role")}</Label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={staffForm.role} name="role" onChange={handleStaffRoleChange}>
                  <option value="OPERATOR">{t("role.operator")}</option><option value="TEAM_LEADER">{t("role.teamLeader")}</option><option value="MECHANIC">{t("role.mechanic")}</option>
                </select>
              </div>
              <div><Label>{t("staff.phone")}</Label><Input value={staffForm.phone} onChange={handleStaffPhoneChange} /></div>
              <div><Label>{t("staff.password")} *</Label><Input type="password" value={staffForm.password} onChange={handleStaffPassChange} required /></div>
              <div><Label>{t("staff.agency")}</Label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={staffForm.agencyId} name="agencyId" onChange={handleStaffAgencyChange}>
                  <option value="">{t("staff.noAgency")}</option>{agencies && agencies.map(function(a) { return <option key={a.id} value={a.id}>{a.name}</option>; })}
                </select>
              </div>
              <div><Label>{t("staff.position")}</Label><Input value={staffForm.position} onChange={handleStaffPosChange} /></div>
              <div><Label>{t("staff.skills")}</Label><Input value={staffForm.skills} onChange={handleStaffSkillChange} /></div>
              <div className="flex items-end"><Button type="submit" className="bg-[#005A9E] hover:bg-[#004B87]">{t("common.save")}</Button></div>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="flex gap-2 border-b pb-2 overflow-x-auto">
        {[
          { id: "all", label: t("staff.allStaff"), icon: "Users", count: (staff && staff.length) || 0 },
          { id: "operators", label: t("staff.operators"), icon: "Users", count: (staff && staff.filter(function(s) { return s.role === "OPERATOR"; }).length) || 0 },
          { id: "leaders", label: t("staff.teamLeaders"), icon: "Users", count: (staff && staff.filter(function(s) { return s.role === "TEAM_LEADER"; }).length) || 0 },
          { id: "mechanics", label: t("staff.mechanics"), icon: "Wrench", count: (staff && staff.filter(function(s) { return s.role === "MECHANIC"; }).length) || 0 },
          { id: "agencies", label: t("staff.agencies"), icon: "Building2", count: (agencies && agencies.length) || 0 },
        ].map(function(tab) {
          var IconComp = tab.icon === "Users" ? Users : tab.icon === "Wrench" ? Wrench : Building2;
          var cls = "flex items-center gap-1.5 px-3 py-2 text-sm rounded-t-md whitespace-nowrap transition-colors ";
          cls += (activeTab === tab.id ? "bg-[#005A9E] text-white" : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800");
          var badgeVariant = activeTab === tab.id ? "secondary" : "outline";
          return (
            <button key={tab.id} onClick={function() { setActiveTab(tab.id); }} className={cls}>
              <IconComp className="h-4 w-4" />{tab.label}<Badge variant={badgeVariant} className="ml-1 text-xs">{tab.count}</Badge>
            </button>);
        })}
      </div>

      {activeTab === "agencies" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agencies && agencies.map(function(agency) {
            return (
              <Card key={agency.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Building2 className="h-5 w-5 text-purple-600" />{agency.name}</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {agency.contactName && <p className="flex items-center gap-1 text-muted-foreground"><Users className="h-3.5 w-3.5" /> {agency.contactName}</p>}
                  {agency.contactEmail && <p className="flex items-center gap-1 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {agency.contactEmail}</p>}
                  {agency.contactPhone && <p className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {agency.contactPhone}</p>}
                  <Badge variant="secondary" className="mt-2">{agency._count && agency._count.users || 0} {t("staff.employeeCount")}</Badge>
                </CardContent>
              </Card>
            );
          })}
          {(!agencies || agencies.length === 0) && <div className="col-span-full text-center py-8 text-muted-foreground"><Building2 className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>{t("common.noData")}</p></div>}
        </div>
      )}

      {activeTab !== "agencies" && (
        <div className="space-y-2">
          {filteredStaff.map(function(person) {
            var isOpen = expandedStaff === person.id;
            var roleCls = person.role === "OPERATOR" ? "bg-blue-100 text-blue-800" : person.role === "TEAM_LEADER" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800";
            var roleLabel = t("role." + (person.role === "TEAM_LEADER" ? "teamLeader" : person.role.toLowerCase()));
            var activeCls = person.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
            return (
              <div key={person.id} className="border rounded-lg overflow-hidden">
                <button onClick={function() { setExpandedStaff(isOpen ? null : person.id); }} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#005A9E] text-white flex items-center justify-center font-bold text-sm">{person.name && person.name.charAt(0)}</div>
                    <div className="text-left">
                      <p className="font-semibold">{person.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> {person.email}{person.phone && <><Phone className="h-3 w-3 ml-2" /> {person.phone}</>}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={roleCls}>{roleLabel}</Badge>
                    <Badge className={activeCls}>{person.isActive ? t("common.active") : t("common.inactive")}</Badge>
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>                {isOpen && (
                  <div className="border-t p-4 space-y-6 bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("staff.agency")}</p><p className="text-sm">{person.agency && person.agency.name || t("staff.noAgency")}</p></div>
                      <div className="space-y-2"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("staff.position")}</p><p className="text-sm">{person.position || "-"}</p></div>
                      <div className="space-y-2"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("staff.assignment")}</p><p className="text-sm">{person.assignments && person.assignments[0] && person.assignments[0].machine && person.assignments[0].machine.name || t("staff.noAssignments")}</p></div>
                    </div>
                    {person.skills && <div className="space-y-2"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Award className="h-3 w-3" /> {t("staff.skills")}</p><p className="text-sm bg-white dark:bg-gray-800 rounded p-2 border">{person.skills}</p></div>}
                    {canManage && (
                      <div className="space-y-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <p className="text-sm font-semibold flex items-center gap-1"><Wrench className="h-4 w-4" /> {t("staff.assignToMachine")}</p>
                        <div className="flex gap-2 items-end">
                          <div className="flex-1"><Label className="text-xs">{t("staff.selectMachine")}</Label>
                            <select className="w-full border rounded-md px-2 py-1.5 text-sm bg-background" value={assignForm[person.id] && assignForm[person.id].machineId || ""} onChange={function(e) { handleAssignMachineChange(person.id, e); }}>
                              <option value="">{t("common.select")}</option>{machines && machines.map(function(m) { return <option key={m.id} value={m.id}>{m.name}</option>; })}
                            </select>
                          </div>
                          <div><Label className="text-xs">{t("staff.selectShift")}</Label>
                            <select className="w-full border rounded-md px-2 py-1.5 text-sm bg-background" value={assignForm[person.id] && assignForm[person.id].shift || "MORNING"} onChange={function(e) { handleAssignShiftChange(person.id, e); }}>
                              <option value="MORNING">MORNING</option><option value="AFTERNOON">AFTERNOON</option><option value="NIGHT">NIGHT</option>
                            </select>
                          </div>
                          <Button size="sm" className="bg-[#005A9E] hover:bg-[#004B87]" onClick={function() { handleAssign(person.id); }}>{t("common.save")}</Button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /> {t("staff.ratings")}
                        {person.ratings && person.ratings.length > 0 && <Badge variant="outline" className="ml-2">{avgRating(person.ratings)} <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" /></Badge>}
                      </p>
                      {person.ratings && person.ratings.slice(0, 3).map(function(r) {
                        var starEls = [1,2,3,4,5].map(function(s) {
                          var starCls = s <= r.score ? "text-yellow-400 fill-yellow-400 h-3.5 w-3.5" : "text-gray-300 h-3.5 w-3.5";
                          return <Star key={s} className={starCls} />;
                        });
                        return (
                          <div key={r.id} className="text-sm bg-white dark:bg-gray-800 rounded p-2 border flex items-start justify-between">
                            <div><span className="inline-flex gap-0.5">{starEls}</span>{r.strengths && <p className="text-xs mt-1 text-muted-foreground">{r.strengths}</p>}{r.notes && <p className="text-xs mt-0.5 text-muted-foreground">{r.notes}</p>}</div>
                            <span className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        );
                      })}
                      {canManage && (
                        <div className="space-y-2 p-2 bg-white dark:bg-gray-800 rounded border">
                          <p className="text-xs font-semibold">{t("staff.addRating")}</p>
                          <div className="flex gap-1">{[1,2,3,4,5].map(function(s) {
                            var starCls = s <= (ratingForm[person.id] && ratingForm[person.id].score || 0) ? "text-yellow-400 fill-yellow-400 h-5 w-5" : "text-gray-300 h-5 w-5";
                            return <button key={s} type="button" onClick={function() { handleRatingClick(person.id, s); }}><Star className={starCls} /></button>;
                          })}</div>
                          <Input placeholder={t("staff.strengths")} className="text-xs" value={ratingForm[person.id] && ratingForm[person.id].strengths || ""} onChange={function(e) { handleRatingStrengthChange(person.id, e); }} />
                          <Input placeholder={t("staff.notes")} className="text-xs" value={ratingForm[person.id] && ratingForm[person.id].notes || ""} onChange={function(e) { handleRatingNotesChange(person.id, e); }} />
                          <Button size="sm" variant="outline" className="text-xs" onClick={function() { handleAddRating(person.id); }}>{t("staff.addRating")}</Button>
                        </div>
                      )}
                    </div>                    <div className="space-y-3">
                      <p className="text-sm font-semibold flex items-center gap-1"><AlertTriangle className="h-4 w-4 text-orange-500" /> {t("staff.incidents")}</p>
                      {person.staffIncidents && person.staffIncidents.slice(0, 3).map(function(inc) {
                        var severityColors = { LOW: "bg-blue-100 text-blue-800", MEDIUM: "bg-yellow-100 text-yellow-800", HIGH: "bg-orange-100 text-orange-800", CRITICAL: "bg-red-100 text-red-800" };
                        var sevCls = severityColors[inc.severity] || severityColors.MEDIUM;
                        return (
                          <div key={inc.id} className="text-sm bg-white dark:bg-gray-800 rounded p-2 border">
                            <div className="flex items-center justify-between">
                              <p className="font-medium flex items-center gap-1">{inc.resolved ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />}{inc.title}</p>
                              <div className="flex items-center gap-2"><Badge className={sevCls}>{inc.severity}</Badge>{!inc.resolved && canManage && <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={function() { resolveIncident(inc.id); }}>{t("incidents.resolve")}</Button>}</div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{inc.description}</p>
                            {inc.resolution && <p className="text-xs text-green-600 mt-1">{inc.resolution}</p>}
                          </div>
                        );
                      })}
                      {canManage && (
                        <div className="space-y-2 p-2 bg-white dark:bg-gray-800 rounded border">
                          <p className="text-xs font-semibold">{t("staff.addIncident")}</p>
                          <Input placeholder={t("incidents.titleRequired")} className="text-xs" value={incidentForm[person.id] && incidentForm[person.id].title || ""} onChange={function(e) { handleIncidentTitleChange(person.id, e); }} />
                          <Textarea placeholder={t("incidents.description")} className="text-xs min-h-[60px]" value={incidentForm[person.id] && incidentForm[person.id].description || ""} onChange={function(e) { handleIncidentDescChange(person.id, e); }} />
                          <div className="flex gap-2">
                            <select className="border rounded-md px-2 py-1 text-xs bg-background" value={incidentForm[person.id] && incidentForm[person.id].severity || "MEDIUM"} onChange={function(e) { handleIncidentSeverityChange(person.id, e); }}>
                              <option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option><option value="CRITICAL">CRITICAL</option>
                            </select>
                            <Button size="sm" variant="outline" className="text-xs" onClick={function() { handleAddIncident(person.id); }}>{t("staff.addIncident")}</Button>
                          </div>
                        </div>
                      )}
                    </div>
                    {canManage && (
                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <Button variant={person.isActive ? "destructive" : "outline"} size="sm" onClick={function() { toggleActive(person.id, person.isActive); }}>
                          {person.isActive ? <UserX className="h-4 w-4 mr-1" /> : <UserCheck className="h-4 w-4 mr-1" />}{person.isActive ? t("common.inactive") : t("common.active")}
                        </Button>
                      </div>
                    )}
                  </div>
                )}              </div>
            );
          })}
          {filteredStaff.length === 0 && !loading && <div className="text-center py-12 text-muted-foreground"><Users className="h-16 w-16 mx-auto mb-3 opacity-20" /><p>{t("common.noData")}</p></div>}
        </div>
      )}
    </div>
  );
}
