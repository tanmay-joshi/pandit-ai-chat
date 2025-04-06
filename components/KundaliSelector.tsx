"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import KundaliForm from "./KundaliForm";

type Kundali = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  createdAt: string;
};

interface KundaliSelectorProps {
  onSelect: (kundaliId: string) => void;
  selectedKundaliId?: string;
}

export default function KundaliSelector({
  onSelect,
  selectedKundaliId,
}: KundaliSelectorProps) {
  const router = useRouter();
  const [kundalis, setKundalis] = useState<Kundali[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchKundalis = async () => {
      try {
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

    fetchKundalis();
  }, []);

  const handleSuccess = async () => {
    setShowAddForm(false);
    // Refresh the kundali list
    try {
      const response = await fetch("/api/kundali");
      if (!response.ok) {
        throw new Error("Failed to fetch kundalis");
      }
      const data = await response.json();
      setKundalis(data);
      // Auto-select the first kundali if none is selected
      if (data.length > 0 && !selectedKundaliId) {
        onSelect(data[0].id);
      }
    } catch (err) {
      console.error("Error refreshing kundalis:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading kundalis...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  // Show add form if there are no kundalis or user clicked add
  if (kundalis.length === 0 || showAddForm) {
    return (
      <div>
        <div className="mb-4">
          {kundalis.length === 0 ? (
            <p className="text-gray-600 text-center mb-4">
              You need to create a Kundali to begin a consultation.
            </p>
          ) : (
            <button
              onClick={() => setShowAddForm(false)}
              className="text-blue-600 hover:underline mb-4"
            >
              ← Back to existing Kundalis
            </button>
          )}
        </div>
        <KundaliForm onSuccess={handleSuccess} onCancel={kundalis.length ? () => setShowAddForm(false) : undefined} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Select a Kundali</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add New Kundali
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {kundalis.map((kundali) => (
          <div
            key={kundali.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedKundaliId === kundali.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onSelect(kundali.id)}
          >
            <div className="flex justify-between">
              <h4 className="font-medium text-lg">{kundali.fullName}</h4>
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              <p><span className="font-medium">Birth Date:</span> {new Date(kundali.dateOfBirth).toLocaleString()}</p>
              <p><span className="font-medium">Birth Place:</span> {kundali.placeOfBirth}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 