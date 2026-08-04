"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../lib/auth-context";
import { api } from "../../../../lib/api";
import ComponentForm from "../../../../components/ComponentForm";

export default function EditComponentPage() {
  const { id } = useParams();
  const { user, token, ready } = useAuth();
  const router = useRouter();
  const [component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ready && !user) router.push("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!user || !token) return;
    api
      .myComponents(token)
      .then(({ components }) => {
        const found = components.find((c) => c.id === id);
        if (!found) {
          setError("Component not found, or it isn't yours to edit.");
        } else {
          setComponent(found);
        }
      })
      .catch((err) => setError(err.message));
  }, [user, token, id]);

  if (!ready || !user) return null;

  async function handleSubmit(payload) {
    const { component: updated } = await api.updateComponent(token, id, payload);
    router.push(`/components/${updated.slug}`);
  }

  return (
    <div className="py-12">
      <h1 className="font-mono text-2xl font-semibold text-ink">Edit component</h1>

      {error && <p className="mt-6 text-sm text-red-300">{error}</p>}
      {!error && !component && <p className="mt-6 text-sm text-muted">Loading…</p>}

      {component && (
        <div className="mt-8">
          <ComponentForm initial={component} onSubmit={handleSubmit} submitLabel="Save changes" />
        </div>
      )}
    </div>
  );
}
