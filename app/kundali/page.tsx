"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import KundaliForm from "@/components/KundaliForm";

type Kundali = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  createdAt: string;
  updatedAt: string;
};

export default function KundaliPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [kundalis, setKundalis] = useState<Kundali[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editKundali, setEditKundali] = useState<Kundali | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch kundalis
  useEffect(() => {
    if (status === "authenticated") {
      fetchKundalis();
    }
  }, [status]);

  const fetchKundalis = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/kundali");
      if (!response.ok) {
        throw new Error("Failed to fetch kundalis");
      }
      const data = await response.json();
      setKundalis(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load kundalis");
      setLoading(false);
      console.error("Error fetching kundalis:", err);
    }
  };

  const handleDeleteKundali = async (id: string) => {
    if (id !== deleteConfirm) return;
    
    try {
      setDeleting(true);
      const response = await fetch(`/api/kundali/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete kundali");
      }

      // Remove from list and reset state
      setKundalis(kundalis.filter(k => k.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting kundali:", err);
      setError(err instanceof Error ? err.message : "Failed to delete kundali");
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    fetchKundalis();
    setShowAddForm(false);
    setEditKundali(null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Kundalis</h1>
        <div className="flex space-x-3">
          <Link
            href="/chat"
            className="rounded-md bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200"
          >
            Back to Chats
          </Link>
          {!showAddForm && !editKundali && (
            <button
              onClick={() => setShowAddForm(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
            >
              Add New Kundali
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="mb-6">
          <KundaliForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {editKundali && (
        <div className="mb-6">
          <KundaliForm
            kundaliId={editKundali.id}
            initialData={editKundali}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditKundali(null)}
          />
        </div>
      )}

      {!showAddForm && !editKundali && (
        <div className="grid gap-4 md:grid-cols-2">
          {kundalis.length > 0 ? (
            kundalis.map((kundali) => (
              <div key={kundali.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{kundali.fullName}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditKundali(kundali)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(kundali.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 text-gray-600">
                  <p className="mb-1">
                    <span className="font-medium">Birth Date:</span> {new Date(kundali.dateOfBirth).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Birth Place:</span> {kundali.placeOfBirth}
                  </p>
                </div>
                
                {deleteConfirm === kundali.id && (
                  <div className="mt-4 rounded-md bg-red-50 p-3">
                    <p className="text-sm text-red-700 mb-2">Are you sure you want to delete this Kundali?</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteKundali(kundali.id)}
                        disabled={deleting}
                        className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                      >
                        {deleting ? "Deleting..." : "Confirm Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">You don't have any Kundalis yet.</p>
              <p className="mt-2 text-gray-500">
                Add a Kundali to begin personalized astrological consultations.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Create Your First Kundali
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 