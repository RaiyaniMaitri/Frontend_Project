import React from "react";

export default function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <div
      style={{
        background: "#fdecea",
        color: "#c0392b",
        padding: "10px 14px",
        borderRadius: 4,
        marginBottom: 12,
        fontSize: 14,
      }}
    >
      {msg}
    </div>
  );
}