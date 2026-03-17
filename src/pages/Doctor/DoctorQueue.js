import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import ErrorMsg from "../../components/ErrorMsg";
import { getDoctorQueue, addPrescription, addReport } from "../../api/doctor";

const emptyMed = { name: "", dosage: "", duration: "" };
const emptyPresc = { notes: "", medicines: [{ ...emptyMed }] };
const emptyReport = { diagnosis: "", testRecommended: "", remarks: "" };

export default function DoctorQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("prescription");
  const [prescForm, setPrescForm] = useState(emptyPresc);
  const [reportForm, setReportForm] = useState(emptyReport);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState({ text: "", type: "" });
  const [saved, setSaved] = useState({});

  useEffect(() => {
    getDoctorQueue()
      .then((res) => setQueue(res.data))
      .catch(() => setError("Failed to load queue."))
      .finally(() => setLoading(false));
  }, []);

  const selectPatient = (q) => {
    setSelected(q);
    setPrescForm(emptyPresc);
    setReportForm(emptyReport);
    setSaveMsg({ text: "", type: "" });
    setActiveTab("prescription");
  };

  const handleMedChange = (i, field, val) => {
    const meds = prescForm.medicines.map((m, idx) =>
      idx === i ? { ...m, [field]: val } : m
    );
    setPrescForm({ ...prescForm, medicines: meds });
  };

  const addMedicine = () =>
    setPrescForm({ ...prescForm, medicines: [...prescForm.medicines, { ...emptyMed }] });

  const removeMedicine = (i) =>
    setPrescForm({
      ...prescForm,
      medicines: prescForm.medicines.filter((_, idx) => idx !== i),
    });

  const handleSavePrescription = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveMsg({ text: "", type: "" });
    try {
      await addPrescription(selected.appointmentId, prescForm);
      setSaveMsg({ text: "Prescription saved successfully!", type: "success" });
      setSaved((prev) => ({ ...prev, [selected.id + "_presc"]: true }));
    } catch (err) {
      setSaveMsg({ text: err.response?.data?.message || err.response?.data?.error || "Failed to save prescription.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReport = async () => {
    if (!selected) return;
    if (!reportForm.diagnosis.trim()) {
      setSaveMsg({ text: "Diagnosis is required.", type: "error" });
      return;
    }
    setSaving(true);
    setSaveMsg({ text: "", type: "" });
    try {
      await addReport(selected.appointmentId, reportForm);
      setSaveMsg({ text: "Report saved successfully!", type: "success" });
      setSaved((prev) => ({ ...prev, [selected.id + "_report"]: true }));
    } catch (err) {
      setSaveMsg({ text: err.response?.data?.message || err.response?.data?.error || "Failed to save report.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2 style={styles.heading}>Today's Queue</h2>
        <ErrorMsg msg={error} />
        {loading ? (
          <Loader />
        ) : (
          <div style={styles.layout}>
            {/* Left panel */}
            <div style={styles.leftPanel}>
              <div style={styles.leftTitle}>Patients ({queue.length})</div>
              {queue.length === 0 ? (
                <p style={{ color: "#888", fontSize: 13, padding: "10px 0" }}>No patients today.</p>
              ) : (
                queue.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      ...styles.queueItem,
                      ...(selected?.id === q.id ? styles.queueItemActive : {}),
                    }}
                    onClick={() => selectPatient(q)}
                  >
                    <div style={styles.qToken}>#{q.tokenNumber || q.token}</div>
                    <div>
                      <div style={styles.qName}>
                        {q.patientName || q.appointment?.patient?.name || "Patient"}
                      </div>
                      <div style={styles.qTime}>{q.timeSlot || ""}</div>
                    </div>
                    {(saved[q.id + "_presc"] || saved[q.id + "_report"]) && (
                      <span style={styles.doneIcon}>✓</span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Right panel */}
            <div style={styles.rightPanel}>
              {!selected ? (
                <div style={styles.emptyState}>
                  ← Select a patient to add prescription / report
                </div>
              ) : (
                <>
                  <div style={styles.patientHeader}>
                    <h3 style={{ margin: 0 }}>
                      {selected.patientName || selected.appointment?.patient?.name || "Patient"}
                    </h3>
                    <span style={styles.apptId}>Appointment #{selected.appointmentId}</span>
                  </div>

                  <div style={styles.tabs}>
                    {["prescription", "report"].map((tab) => (
                      <button
                        key={tab}
                        style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
                        onClick={() => { setActiveTab(tab); setSaveMsg({ text: "", type: "" }); }}
                      >
                        {tab === "prescription" ? "💊 Prescription" : "📋 Report"}
                        {saved[selected.id + "_" + (tab === "prescription" ? "presc" : "report")] && (
                          <span style={{ marginLeft: 6, color: "#4caf50" }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Prescription Tab */}
                  {activeTab === "prescription" && (
                    <div style={styles.formBody}>
                      <div style={styles.field}>
                        <label style={styles.label}>Notes</label>
                        <textarea
                          style={styles.textarea}
                          rows={2}
                          placeholder="General notes..."
                          value={prescForm.notes}
                          onChange={(e) => setPrescForm({ ...prescForm, notes: e.target.value })}
                        />
                      </div>

                      <div style={styles.medicinesHeader}>
                        <label style={styles.label}>Medicines</label>
                        <button style={styles.addMedBtn} onClick={addMedicine}>+ Add</button>
                      </div>

                      <div style={styles.medTableWrapper}>
                        <table style={styles.medTable}>
                          <thead>
                            <tr>
                              {["Medicine Name *", "Dosage *", "Duration *", ""].map((h) => (
                                <th key={h} style={styles.medTh}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {prescForm.medicines.map((m, i) => (
                              <tr key={i}>
                                {["name", "dosage", "duration"].map((f) => (
                                  <td key={f} style={styles.medTd}>
                                    <input
                                      style={styles.medInput}
                                      placeholder={f}
                                      value={m[f]}
                                      onChange={(e) => handleMedChange(i, f, e.target.value)}
                                    />
                                  </td>
                                ))}
                                <td style={styles.medTd}>
                                  {prescForm.medicines.length > 1 && (
                                    <button style={styles.removeBtn} onClick={() => removeMedicine(i)}>✕</button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {saveMsg.text && activeTab === "prescription" && (
                        <div style={saveMsg.type === "success" ? styles.successMsg : styles.errorMsg}>
                          {saveMsg.text}
                        </div>
                      )}
                      <button style={styles.saveBtn} onClick={handleSavePrescription} disabled={saving}>
                        {saving ? "Saving..." : "Save Prescription"}
                      </button>
                    </div>
                  )}

                  {/* Report Tab */}
                  {activeTab === "report" && (
                    <div style={styles.formBody}>
                      <div style={styles.field}>
                        <label style={styles.label}>Diagnosis *</label>
                        <textarea
                          style={styles.textarea}
                          rows={3}
                          placeholder="Patient diagnosis..."
                          value={reportForm.diagnosis}
                          onChange={(e) => setReportForm({ ...reportForm, diagnosis: e.target.value })}
                        />
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label}>Tests Recommended</label>
                        <input
                          style={styles.input}
                          placeholder="e.g. Blood test, X-Ray..."
                          value={reportForm.testRecommended}
                          onChange={(e) => setReportForm({ ...reportForm, testRecommended: e.target.value })}
                        />
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label}>Remarks</label>
                        <textarea
                          style={styles.textarea}
                          rows={2}
                          placeholder="Additional remarks..."
                          value={reportForm.remarks}
                          onChange={(e) => setReportForm({ ...reportForm, remarks: e.target.value })}
                        />
                      </div>
                      {saveMsg.text && activeTab === "report" && (
                        <div style={saveMsg.type === "success" ? styles.successMsg : styles.errorMsg}>
                          {saveMsg.text}
                        </div>
                      )}
                      <button style={styles.saveBtn} onClick={handleSaveReport} disabled={saving}>
                        {saving ? "Saving..." : "Save Report"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 1050, margin: "0 auto" },
  heading: { margin: "0 0 20px", color: "#1a1a2e" },
  layout: { display: "flex", gap: 20, alignItems: "flex-start" },
  leftPanel: { width: 220, flexShrink: 0, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 14 },
  leftTitle: { fontWeight: 700, fontSize: 13, color: "#888", marginBottom: 10, textTransform: "uppercase" },
  queueItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 6, marginBottom: 6, cursor: "pointer", border: "1px solid #eee", background: "#fafafa" },
  queueItemActive: { background: "#1a1a2e", border: "1px solid #1a1a2e", color: "#fff" },
  qToken: { background: "#e0e0e0", borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 700, color: "#333", flexShrink: 0 },
  qName: { fontSize: 13, fontWeight: 600 },
  qTime: { fontSize: 11, opacity: 0.7 },
  doneIcon: { marginLeft: "auto", color: "#4caf50", fontWeight: 700 },
  rightPanel: { flex: 1, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 24, minHeight: 400 },
  emptyState: { color: "#aaa", textAlign: "center", paddingTop: 80, fontSize: 14 },
  patientHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #eee" },
  apptId: { fontSize: 12, color: "#aaa" },
  tabs: { display: "flex", marginBottom: 20, borderBottom: "2px solid #eee" },
  tab: { background: "none", border: "none", padding: "8px 20px", cursor: "pointer", fontSize: 14, color: "#888", borderBottom: "2px solid transparent", marginBottom: -2 },
  tabActive: { color: "#1a1a2e", borderBottom: "2px solid #1a1a2e", fontWeight: 700 },
  formBody: {},
  field: { marginBottom: 14 },
  label: { display: "block", fontSize: 13, color: "#555", marginBottom: 4, fontWeight: 600 },
  input: { width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box" },
  textarea: { width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box", resize: "vertical" },
  medicinesHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  addMedBtn: { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7", padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 },
  medTableWrapper: { overflowX: "auto", marginBottom: 14 },
  medTable: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  medTh: { background: "#f5f5f5", padding: "7px 10px", textAlign: "left", fontSize: 12, fontWeight: 600, borderBottom: "1px solid #eee" },
  medTd: { padding: "4px 6px", borderBottom: "1px solid #f5f5f5" },
  medInput: { width: "100%", padding: "5px 8px", border: "1px solid #e0e0e0", borderRadius: 4, fontSize: 13, boxSizing: "border-box" },
  removeBtn: { background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontSize: 12 },
  saveBtn: { background: "#1a1a2e", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600, marginTop: 4 },
  successMsg: { background: "#e8f5e9", color: "#2e7d32", padding: "8px 12px", borderRadius: 4, fontSize: 13, marginBottom: 10 },
  errorMsg: { background: "#fdecea", color: "#c0392b", padding: "8px 12px", borderRadius: 4, fontSize: 13, marginBottom: 10 },
};