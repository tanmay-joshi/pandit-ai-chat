"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type KundaliFormProps = {
  kundaliId?: string;
  initialData?: {
    fullName: string;
    dateOfBirth: string;
    placeOfBirth: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function KundaliForm({
  kundaliId,
  initialData,
  onSuccess,
  onCancel,
}: KundaliFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().slice(0, 16) // Format as YYYY-MM-DDThh:mm
      : ""
  );
  const [placeOfBirth, setPlaceOfBirth] = useState(initialData?.placeOfBirth || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!kundaliId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!fullName || !dateOfBirth || !placeOfBirth) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const url = isEdit
        ? `/api/kundali/${kundaliId}`
        : "/api/kundali";
      
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          dateOfBirth,
          placeOfBirth,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save Kundali");
      }

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error saving Kundali:", err);
      setError(err instanceof Error ? err.message : "Failed to save Kundali");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Kundali" : "Create New Kundali"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date and Time of Birth
          </label>
          <input
            id="dateOfBirth"
            type="datetime-local"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Please include the exact time of birth for more accurate readings
          </p>
        </div>
        
        <div>
          <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Place of Birth
          </label>
          <input
            id="placeOfBirth"
            type="text"
            value={placeOfBirth}
            onChange={(e) => setPlaceOfBirth(e.target.value)}
            placeholder="City, State, Country"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Saving..." : isEdit ? "Update Kundali" : "Create Kundali"}
          </button>
        </div>
      </form>
    </div>
  );
} 