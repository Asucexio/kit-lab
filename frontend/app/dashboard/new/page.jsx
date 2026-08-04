"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth-context";
import { api } from "../../../lib/api";
import ComponentForm from "../../../components/ComponentForm";

export default function NewComponentPage() {
  const { user, token, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.push("/login");
  }, [ready, user, router]);

  if (!ready || !user) return null;

  async function handleSubmit(payload) {
    const { component } = await api.createComponent(token, payload);
    router.push(`/components/${component.slug}`);
  }

  return (
    <div className="py-12">
      <h1 className="font-mono text-2xl font-semibold text-ink">Publish a component</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Write a component that renders itself — end your code with{" "}
        <span className="text-ink">render(&lt;YourComponent /&gt;)</span>. The preview on the
        right updates as you type.
      </p>

      <div className="mt-8">
        <ComponentForm onSubmit={handleSubmit} submitLabel="Publish" />
      </div>
    </div>
  );
}
