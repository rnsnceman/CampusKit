import React, { useEffect, useRef, useState } from "react";
import { getEquipmentPhoto } from "./equipmentPhotos.js";
const categories = ["Audio", "Cameras", "Computing", "Accessories"];
function Icon({ name, size = 20, ...props }) {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    bag: (
      <>
        <rect x="4" y="7" width="16" height="14" rx="2" />
        <path d="M8 7V5a4 4 0 0 1 8 0v2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 22v-3a8 8 0 0 1 16 0v3" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    logout: (
      <>
        <path d="M9 4H4v16h5m5-13 5 5-5 5M8 12h12" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    camera: (
      <>
        <rect x="2" y="6" width="20" height="14" rx="3" />
        <path d="m7 6 2-3h6l2 3" />
        <circle cx="12" cy="13" r="4" />
      </>
    ),
    audio: (
      <>
        <rect x="8" y="2" width="8" height="13" rx="4" />
        <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8" />
      </>
    ),
    computer: (
      <>
        <rect x="4" y="3" width="16" height="13" rx="2" />
        <path d="M1 21h22l-3-5H4Z" />
      </>
    ),
    accessory: (
      <>
        <path d="m12 3 9 5v9l-9 5-9-5V8Zm0 10v9M3 8l9 5 9-5M8 5l9 5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.bag}
    </svg>
  );
}
function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Icon name="accessory" size={25} />
      </span>
      <span>
        Campus<span className="brand-light">Kit</span>
        <small>GOOD TO GO.</small>
      </span>
    </div>
  );
}
const artIcons = {
  Audio: "audio",
  Cameras: "camera",
  Computing: "computer",
  Accessories: "accessory",
};
function Art({ category = "Accessories", name = "", compact = false }) {
  const photo = getEquipmentPhoto(name);
  const [failedSrc, setFailedSrc] = useState(null);
  const className = "art art-" + category.toLowerCase() + (compact ? " art--compact" : "");
  if (photo && failedSrc !== photo.src) {
    return (
      <div className={className + " equipment-photo"}>
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          width="960"
          height="640"
          onError={() => setFailedSrc(photo.src)}
        />
        {!compact && photo.reference && <span className="photo-note">Reference photo</span>}
      </div>
    );
  }
  return (
    <div className={className}>
      <div className="orbit" />
      <Icon name={artIcons[category]} size={compact ? 28 : 82} />
      {!compact && <span className="art-label">{category.toUpperCase()} / CAMPUS ESSENTIALS</span>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  const ref = useRef();
  useEffect(() => {
    const d = ref.current;
    d.showModal();
    return () => d.close();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="dialog-head">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Badge({ status }) {
  return (
    <span className={"badge " + status}>
      <span />
      {{
        "on-loan": "On loan",
        available: "Available",
        maintenance: "Maintenance",
        pending: "Pending review",
        approved: "Approved",
        cancelled: "Cancelled",
        returned: "Returned",
        rejected: "Rejected",
      }[status] || status}
    </span>
  );
}
const date = (d) =>
  new Date(d).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
export default function App() {
  const [session, setSession] = useState(null),
    [view, setView] = useState("catalog"),
    [equipment, setEquipment] = useState([]),
    [requests, setRequests] = useState([]),
    [users, setUsers] = useState([]),
    [loading, setLoading] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [modal, setModal] = useState(null),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("All equipment"),
    [available, setAvailable] = useState(false),
    [authMode, setAuthMode] = useState("login");
  const admin = session?.user.role === "admin";
  async function api(path, options = {}) {
    const res = await fetch("/api" + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(session ? { Authorization: "Bearer " + session.token } : {}),
        ...options.headers,
      },
    });
    const data = res.status === 204 ? null : await res.json();
    if (!res.ok) {
      if (res.status === 401 && session) {
        setSession(null);
        setModal(null);
      }
      throw new Error(data?.message || "Request failed.");
    }
    return data;
  }
  async function refresh() {
    setLoading(true);
    try {
      const [e, r, u] = await Promise.all([
        api("/equipment"),
        api("/requests"),
        admin ? api("/users") : Promise.resolve({ users: [] }),
      ]);
      setEquipment(e.equipment);
      setRequests(r.requests);
      setUsers(u.users);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (session) refresh();
  }, [session?.token]);
  useEffect(() => {
    setError("");
    setNotice("");
  }, [view]);
  async function act(fn, message, close = true) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      if (close) setModal(null);
      setNotice(message);
      if (session) await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const body = (data) => JSON.stringify(data);
  async function auth(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setError("");
    try {
      const s = await api(
        "/auth/" + (authMode === "login" ? "login" : "register"),
        { method: "POST", body: body(data) },
      );
      setSession(s);
      setView("catalog");
      setNotice("");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const today = new Date().toISOString().slice(0, 10),
    maxDate = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const filtered = equipment.filter(
    (e) =>
      (category === "All equipment" || e.category === category) &&
      (!available || e.status === "available") &&
      `${e.name} ${e.assetTag} ${e.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const pending = requests.filter((r) => r.status === "pending").length;
  function logout() {
    setSession(null);
    setEquipment([]);
    setRequests([]);
    setUsers([]);
    setModal(null);
    setError("");
    setNotice("");
  }
  if (!session)
    return (
      <div className="auth-page">
        <section className="auth-story">
          <Brand />
          <div>
            <span className="eyebrow">LESS BUYING. MORE MAKING.</span>
            <h1>
              Your next big idea.
              <br />
              <em>Our equipment.</em>
            </h1>
            <p>
              From your first podcast to your final project, borrow the tools to
              bring it to life.
            </p>
            <div className="auth-icons">
              <Icon name="camera" size={42} />
              <Icon name="audio" size={42} />
              <Icon name="computer" size={42} />
            </div>
          </div>
          <small>A little sharing goes a long way.</small>
        </section>
        <main className="auth-form">
          <div className="mobile-brand">
            <Brand />
          </div>
          <span className="eyebrow">WELCOME TO CAMPUSKIT</span>
          <h2>
            {authMode === "login" ? "Good to see you." : "Make room for ideas."}
          </h2>
          <p>
            {authMode === "login"
              ? "Sign in to find your next campus essential."
              : "Create a student account to start borrowing."}
          </p>
          {error && (
            <div className="alert error" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={auth}>
            {authMode === "register" && (
              <Field label="Full name">
                <input
                  name="name"
                  autoComplete="name"
                  maxLength={80}
                  required
                />
              </Field>
            )}
            <Field label="Email address">
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                placeholder="you@college.ca"
              />
            </Field>
            <Field label="Password">
              <input
                name="password"
                type="password"
                autoComplete={
                  authMode === "login" ? "current-password" : "new-password"
                }
                minLength={10}
                maxLength={72}
                required
                placeholder="At least 10 characters"
              />
            </Field>
            <button className="primary full" disabled={busy}>
              {busy
                ? "Please wait…"
                : authMode === "login"
                  ? "Sign in"
                  : "Create account"}
              <Icon name="arrow" />
            </button>
          </form>
          <p className="switch-auth">
            {authMode === "login" ? "New around here?" : "Already a member?"}{" "}
            <button
              className="text-button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {authMode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
          <div className="auth-note">
            <Icon name="bag" />
            <span>
              Borrow. Create. Return. Repeat.
              <br />
              <small>Campus equipment, all in one place.</small>
            </span>
          </div>
        </main>
      </div>
    );
  return (
    <div className="shell">
      <aside className="sidebar">
        <Brand />
        <div className="workspace-label">YOUR CAMPUS WORKSPACE</div>
        <nav>
          {[
            [
              "catalog",
              "grid",
              admin ? "Equipment inventory" : "Explore equipment",
            ],
            ["requests", "bag", admin ? "Borrowing requests" : "My borrowing"],
            ...(admin ? [["users", "user", "Students"]] : []),
            ["profile", "user", "My account"],
          ].map(([key, icon, label]) => (
            <button
              key={key}
              className={view === key ? "nav-item active" : "nav-item"}
              onClick={() => setView(key)}
            >
              <Icon name={icon} />
              <span>{label}</span>
              {key === "requests" && pending > 0 && <b>{pending}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sharing-note">
            <span>
              Big ideas.
              <br />
              Smaller footprint.
            </span>
            <p>
              Make the most of what
              <br />
              your campus has to offer.
            </p>
            <Icon name="accessory" size={30} />
          </div>
          <div className="person">
            <div className="avatar">
              {session.user.name.charAt(0).toUpperCase()}
            </div>
            <span>
              <strong>{session.user.name}</strong>
              <small>{admin ? "Administrator" : "Student member"}</small>
            </span>
            <button
              className="icon-button"
              onClick={logout}
              aria-label="Sign out"
            >
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span>
            Campus workspace <span className="crumb">/</span>{" "}
            <strong>
              {view === "catalog"
                ? "Equipment"
                : view === "requests"
                  ? "Borrowing"
                  : view === "users"
                    ? "Students"
                    : "Account"}
            </strong>
          </span>
          <div className="top-right">
            <span className="semester">COMP229 · FIRST RELEASE</span>
            <button
              className="icon-button refresh"
              onClick={refresh}
              disabled={loading}
              title="Refresh records"
              aria-label="Refresh records"
            >
              ↻
            </button>
            <div className="avatar small">
              {session.user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="content">
          <div aria-live="polite">
            {notice && <div className="alert success">{notice}</div>}
            {error && !modal && (
              <div className="alert error" role="alert">
                {error}
              </div>
            )}
          </div>
          {view === "catalog" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">THE CAMPUS COLLECTION</span>
                  <h1>
                    {admin
                      ? "Great tools. In good hands."
                      : "What will you create next?"}
                  </h1>
                  <p>
                    {admin
                      ? "Manage your equipment and keep campus creativity moving."
                      : "Find the right tools. Borrow them. Make something great."}
                  </p>
                </div>
                {admin && (
                  <button
                    className="primary"
                    onClick={() => {
                      setError("");
                      setModal({ type: "equipment" });
                    }}
                  >
                    <Icon name="plus" />
                    Add equipment
                  </button>
                )}
              </div>
              <section className="hero">
                <div>
                  <span className="hero-tag">
                    <span />
                    SHARED TOOLS. UNLIMITED POSSIBILITIES.
                  </span>
                  <h2>
                    A little equipment.
                    <br />A lot of potential.
                  </h2>
                  <p>
                    Camera kits, recording gear, and everyday essentials.
                    <br />
                    Your next project starts right here.
                  </p>
                  <button
                    className="hero-link"
                    onClick={() => {
                      setCategory("All equipment");
                      setAvailable(true);
                      document
                        .getElementById("collection")
                        .scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Explore available equipment <Icon name="arrow" size={17} />
                  </button>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="hero-circle" />
                  <Icon name="camera" size={125} />
                  <div className="hero-sticker">
                    YOURS TO
                    <br />
                    <strong>CREATE.</strong>
                    <span>↗</span>
                  </div>
                </div>
                <span className="hero-index">
                  01 / THE POSSIBILITIES ARE ENDLESS
                </span>
              </section>
              <div className="stats">
                <div>
                  <span className="stat-icon">
                    <Icon name="grid" />
                  </span>
                  <span>
                    <strong>{equipment.length}</strong>
                    <small>Equipment items</small>
                  </span>
                </div>
                <div>
                  <span className="stat-icon">
                    <Icon name="check" />
                  </span>
                  <span>
                    <strong>
                      {equipment.filter((e) => e.status === "available").length}
                    </strong>
                    <small>Ready to borrow</small>
                  </span>
                </div>
                <div>
                  <span className="stat-icon">
                    <Icon name="bag" />
                  </span>
                  <span>
                    <strong>
                      {requests.filter((r) => r.status === "approved").length}
                    </strong>
                    <small>
                      {admin ? "Active loans" : "Your active loans"}
                    </small>
                  </span>
                </div>
                <div>
                  <span className="stat-icon">
                    <Icon name="clock" />
                  </span>
                  <span>
                    <strong>{pending}</strong>
                    <small>
                      {admin ? "Awaiting review" : "Your pending requests"}
                    </small>
                  </span>
                </div>
              </div>
              <section id="collection" className="collection">
                <div className="section-heading">
                  <h2>
                    {admin ? "Equipment inventory" : "Explore the collection"}{" "}
                    <span>{equipment.length}</span>
                  </h2>
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => setAvailable(e.target.checked)}
                    />
                    Available only
                  </label>
                </div>
                <div className="filters">
                  <div className="tabs" aria-label="Equipment categories">
                    {["All equipment", ...categories].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={category === c ? "selected" : ""}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <label className="search">
                    <Icon name="search" size={17} />
                    <input
                      aria-label="Search equipment"
                      placeholder="Search equipment…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                </div>
                {loading && equipment.length === 0 ? (
                  <p role="status">Loading equipment…</p>
                ) : (
                  <div className="equipment-grid">
                    {filtered.map((item) => (
                      <article className="equipment-card" key={item._id}>
                        <Art category={item.category} name={item.name} />
                        <div className="card-body">
                          <div className="card-meta">
                            <span>{item.category}</span>
                            <Badge status={item.status} />
                          </div>
                          <h3>{item.name}</h3>
                          <p className="description">{item.description}</p>
                          <div className="location">
                            <Icon name="pin" size={14} />
                            {item.location}
                            <span>{item.assetTag}</span>
                          </div>
                          <button
                            className="card-action"
                            onClick={() => {
                              setError("");
                              setModal({
                                type: admin ? "equipment" : "borrow",
                                item,
                              });
                            }}
                          >
                            {admin ? "Manage equipment" : "View equipment"}
                            <Icon name="arrow" size={17} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                {!loading && filtered.length === 0 && (
                  <div className="empty">
                    <Icon name="search" size={36} />
                    <h3>No equipment found</h3>
                    <p>
                      {equipment.length
                        ? "Try a different search or category."
                        : admin
                          ? "Add your first asset to get started."
                          : "The collection is being prepared. Check back soon."}
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
          {view === "requests" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">KEEP THINGS MOVING</span>
                  <h1>
                    {admin ? "Borrowing requests" : "Your ideas, in progress."}
                  </h1>
                  <p>
                    {admin
                      ? "Review requests, approve loans, and record equipment returns."
                      : "Track requests and manage the tools for your next project."}
                  </p>
                </div>
              </div>
              <div className="request-list">
                {requests.map((r) => (
                  <article className="request-card" key={r._id}>
                    <Art
                      category={r.equipment?.category}
                      name={r.equipment?.name || r.equipmentName}
                      compact
                    />
                    <div className="request-info">
                      <div className="request-title">
                        <h3>{r.equipment?.name || r.equipmentName}</h3>
                        <Badge status={r.status} />
                      </div>
                      <p>{r.purpose}</p>
                      <small>
                        {admin ? `${r.user?.name || r.requesterName} · ` : ""}
                        {r.assetTag} · Due {date(r.dueDate)}
                      </small>
                      {r.decisionNote && (
                        <p className="decision-note">
                          Staff note: {r.decisionNote}
                        </p>
                      )}
                    </div>
                    <div className="request-actions">
                      {admin ? (
                        <>
                          {r.status === "pending" && (
                            <>
                              <button
                                className="primary compact"
                                disabled={busy}
                                onClick={() => {
                                  setError("");
                                  setModal({
                                    type: "decision",
                                    request: r,
                                    action: "approve",
                                  });
                                }}
                              >
                                Approve
                              </button>
                              <button
                                className="secondary compact"
                                disabled={busy}
                                onClick={() => {
                                  setError("");
                                  setModal({
                                    type: "decision",
                                    request: r,
                                    action: "reject",
                                  });
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {r.status === "approved" && (
                            <button
                              className="primary compact"
                              onClick={() => {
                                setError("");
                                setModal({
                                  type: "decision",
                                  request: r,
                                  action: "return",
                                });
                              }}
                            >
                              Record return
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {r.status === "pending" && (
                            <>
                              <button
                                className="secondary compact"
                                onClick={() => {
                                  setError("");
                                  setModal({
                                    type: "borrow",
                                    item: r.equipment,
                                    request: r,
                                  });
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-button"
                                disabled={busy}
                                onClick={() =>
                                  act(
                                    () =>
                                      api("/requests/" + r._id, {
                                        method: "PATCH",
                                        body: body({ action: "cancel" }),
                                      }),
                                    "Request cancelled.",
                                  )
                                }
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {r.status !== "approved" && (
                            <button
                              className="text-button danger"
                              onClick={() => {
                                setError("");
                                setModal({ type: "deleteRequest", request: r });
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              {!requests.length && (
                <div className="empty">
                  <Icon name="bag" size={42} />
                  <h3>
                    {admin
                      ? "All caught up."
                      : "Your next project starts here."}
                  </h3>
                  <p>
                    {admin
                      ? "New borrowing requests will appear here."
                      : "Choose equipment from the collection to make your first request."}
                  </p>
                  <button
                    className="secondary"
                    onClick={() => setView("catalog")}
                  >
                    Explore equipment <Icon name="arrow" />
                  </button>
                </div>
              )}
            </>
          )}
          {view === "users" && admin && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">THE CAMPUS COMMUNITY</span>
                  <h1>People behind the projects.</h1>
                  <p>Registered students and staff in your workspace.</p>
                </div>
              </div>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>
                          {u.role === "student" && (
                            <button
                              className="text-button danger"
                              onClick={() => {
                                setError("");
                                setModal({ type: "deleteUser", user: u });
                              }}
                            >
                              Delete account
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {view === "profile" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">YOUR CAMPUS IDENTITY</span>
                  <h1>Make yourself at home.</h1>
                  <p>Keep your profile and sign-in details up to date.</p>
                </div>
              </div>
              <section className="profile-panel">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(
                      new FormData(e.currentTarget),
                    );
                    act(
                      async () => {
                        const r = await api("/users/" + session.user._id, {
                          method: "PATCH",
                          body: body(data),
                        });
                        setSession((s) => ({ ...s, user: r.user }));
                      },
                      "Profile updated.",
                      false,
                    );
                  }}
                >
                  <h2>Profile details</h2>
                  <Field label="Full name">
                    <input
                      name="name"
                      defaultValue={session.user.name}
                      maxLength={80}
                      required
                    />
                  </Field>
                  <Field label="Email address">
                    <input
                      name="email"
                      type="email"
                      defaultValue={session.user.email}
                      maxLength={254}
                      required
                    />
                  </Field>
                  <button className="primary" disabled={busy}>
                    Save changes
                  </button>
                </form>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(
                      new FormData(e.currentTarget),
                    );
                    act(
                      async () => {
                        await api("/users/" + session.user._id, {
                          method: "PATCH",
                          body: body(data),
                        });
                        logout();
                      },
                      "Password changed. Sign in again.",
                      false,
                    );
                  }}
                >
                  <h2>Change password</h2>
                  <Field label="Current password">
                    <input
                      name="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      required
                    />
                  </Field>
                  <Field label="New password">
                    <input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      minLength={10}
                      maxLength={72}
                      required
                    />
                  </Field>
                  <button className="secondary" disabled={busy}>
                    Update password
                  </button>
                </form>
                {!admin && (
                  <div>
                    <h2>Delete account</h2>
                    <p>
                      Resolve pending requests and return all equipment first.
                    </p>
                    <button
                      className="text-button danger"
                      onClick={() => {
                        setError("");
                        setModal({ type: "deleteUser", user: session.user });
                      }}
                    >
                      Delete my account
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
          <footer>
            CampusKit <span>Shared tools. Brighter ideas.</span>
            <small><a href="/equipment/photo-credits.html" target="_blank" rel="noreferrer">Photo credits</a> · COMP229 · Equipment lending</small>
          </footer>
        </main>
      </div>
      {modal && (
        <Modal
          title={
            {
              equipment: modal.item ? "Manage equipment" : "Add equipment",
              borrow: modal.request
                ? "Edit borrowing request"
                : "Make it happen.",
              decision:
                modal.action === "return"
                  ? "Record equipment return"
                  : modal.action === "approve"
                    ? "Approve borrowing request"
                    : "Reject borrowing request",
              deleteRequest: "Delete this request?",
              deleteEquipment: "Delete this equipment?",
              deleteUser: "Delete this account?",
            }[modal.type]
          }
          onClose={() => {
            if (!busy) {
              setModal(null);
              setError("");
            }
          }}
        >
          {error && (
            <div className="alert error" role="alert">
              {error}
            </div>
          )}
          {modal.type === "equipment" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.currentTarget));
                if (modal.item?.status === "on-loan") delete data.status;
                act(
                  () =>
                    api(
                      "/equipment" + (modal.item ? "/" + modal.item._id : ""),
                      {
                        method: modal.item ? "PATCH" : "POST",
                        body: body(data),
                      },
                    ),
                  "Equipment saved.",
                );
              }}
            >
              <Field label="Equipment name">
                <input
                  name="name"
                  defaultValue={modal.item?.name}
                  maxLength={100}
                  required
                  autoFocus
                />
              </Field>
              <div className="two-fields">
                <Field label="Category">
                  <select
                    name="category"
                    defaultValue={modal.item?.category || "Audio"}
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Asset tag">
                  <input
                    name="assetTag"
                    defaultValue={modal.item?.assetTag}
                    maxLength={30}
                    required
                  />
                </Field>
              </div>
              <Field label="Pickup location">
                <input
                  name="location"
                  defaultValue={modal.item?.location}
                  maxLength={100}
                  required
                />
              </Field>
              <Field label="Description">
                <textarea
                  name="description"
                  defaultValue={modal.item?.description}
                  maxLength={1200}
                  rows={3}
                />
              </Field>
              <Field label="Availability">
                <select
                  name="status"
                  defaultValue={modal.item?.status || "available"}
                  disabled={modal.item?.status === "on-loan"}
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  {modal.item?.status === "on-loan" && (
                    <option value="on-loan">
                      On loan - record its return first
                    </option>
                  )}
                </select>
              </Field>
              <div className="dialog-actions">
                {modal.item && (
                  <button
                    type="button"
                    className="text-button danger"
                    disabled={busy}
                    onClick={() =>
                      setModal({ type: "deleteEquipment", item: modal.item })
                    }
                  >
                    Delete equipment
                  </button>
                )}
                <button className="primary" disabled={busy}>
                  {busy ? "Saving…" : "Save equipment"}
                </button>
              </div>
            </form>
          )}
          {modal.type === "borrow" && (
            <>
              <div className="equipment-detail-photo">
                <Art category={modal.item?.category} name={modal.item?.name} />
              </div>
              <div className="borrow-summary">
                <div className="request-icon">
                  <Icon name={artIcons[modal.item?.category]} size={30} />
                </div>
                <div>
                  <h3>{modal.item?.name}</h3>
                  <p>
                    {modal.item?.assetTag} · {modal.item?.location}
                  </p>
                </div>
              </div>
              <p>{modal.item?.description}</p>
              {!modal.request && modal.item?.status !== "available" ? (
                <div className="alert">
                  This item is currently {modal.item?.status}. Check back later.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(
                      new FormData(e.currentTarget),
                    );
                    act(
                      () =>
                        api(
                          "/requests" +
                            (modal.request ? "/" + modal.request._id : ""),
                          {
                            method: modal.request ? "PATCH" : "POST",
                            body: body({
                              ...data,
                              ...(modal.request
                                ? { action: "edit" }
                                : { equipment: modal.item._id }),
                            }),
                          },
                        ),
                      modal.request
                        ? "Request updated."
                        : "Request sent. Staff will review it shortly.",
                    );
                  }}
                >
                  <Field label="Return date (within 30 days)">
                    <input
                      type="date"
                      name="dueDate"
                      defaultValue={modal.request?.dueDate?.slice(0, 10)}
                      min={today}
                      max={maxDate}
                      required
                    />
                  </Field>
                  <Field label="What are you working on?">
                    <textarea
                      name="purpose"
                      rows={3}
                      defaultValue={modal.request?.purpose}
                      placeholder="Tell us a little about your project…"
                      maxLength={500}
                      required
                    />
                  </Field>
                  <p className="form-hint">
                    Your request needs staff approval. Pickup is arranged at the
                    listed location.
                  </p>
                  <button className="primary full" disabled={busy}>
                    {busy
                      ? "Saving…"
                      : modal.request
                        ? "Save changes"
                        : "Send borrowing request"}
                    <Icon name="arrow" />
                  </button>
                </form>
              )}
            </>
          )}
          {modal.type === "decision" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.currentTarget));
                act(
                  () =>
                    api("/requests/" + modal.request._id, {
                      method: "PATCH",
                      body: body({ action: modal.action, ...data }),
                    }),
                  "Request updated.",
                );
              }}
            >
              <p>
                <strong>{modal.request.equipmentName}</strong> ·{" "}
                {modal.request.requesterName}
              </p>
              <p>
                {modal.action === "return"
                  ? "Confirm the equipment has been physically returned. It will become available again."
                  : modal.action === "approve"
                    ? "Approving this request reserves this physical asset for this student."
                    : "The student will see your decision and any note below."}
              </p>
              <Field label="Staff note (optional)">
                <textarea name="decisionNote" maxLength={500} rows={3} />
              </Field>
              <button className="primary full" disabled={busy}>
                Confirm {modal.action}
              </button>
            </form>
          )}
          {modal.type.startsWith("delete") && (
            <>
              <p>
                This permanently deletes{" "}
                {modal.type === "deleteEquipment"
                  ? modal.item.name
                  : modal.type === "deleteUser"
                    ? modal.user.name + "’s account"
                    : "the borrowing request"}
                . This action cannot be undone.
              </p>
              <div className="dialog-actions">
                <button
                  className="secondary"
                  disabled={busy}
                  onClick={() => setModal(null)}
                >
                  Keep it
                </button>
                <button
                  className="primary destructive"
                  disabled={busy}
                  onClick={() =>
                    act(async () => {
                      const type = modal.type;
                      const id =
                        type === "deleteEquipment"
                          ? modal.item._id
                          : type === "deleteUser"
                            ? modal.user._id
                            : modal.request._id;
                      await api(
                        "/" +
                          (type === "deleteEquipment"
                            ? "equipment"
                            : type === "deleteUser"
                              ? "users"
                              : "requests") +
                          "/" +
                          id,
                        { method: "DELETE" },
                      );
                      if (type === "deleteUser" && id === session.user._id)
                        logout();
                    }, "Deleted successfully.")
                  }
                >
                  {busy ? "Deleting…" : "Delete permanently"}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
