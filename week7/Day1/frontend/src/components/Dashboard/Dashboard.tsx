import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetCVsQuery, useDeleteCVMutation } from "@/lib/services/cvApi";
import CVEditor from "@/components/CV/CVEditor";
import CVPreview from "@/components/CV/CVPreview";
import { RootState } from "@/lib/store";
import { RSC_PREFETCH_SUFFIX } from "next/dist/lib/constants";

export default function Dashboard() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingCV, setEditingCV] = useState<any>(null);
  const { data: cvs, isLoading, error, refetch } = useGetCVsQuery();
  const [deleteCV] = useDeleteCVMutation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleEdit = (cv: any) => {
    setEditingCV(cv);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      try {
        await deleteCV(id).unwrap();
      } catch (error) {
        console.error("Failed to delete CV:", error);
      }
    }
    refetch();
  };

  const handleNewCV = () => {
    setEditingCV(null);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingCV(null);
    refetch();
  };

  // Dummy CV template
  const dummyCV = {
    personalInfo: {
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "+123456789",
      address: "123 Main Street, City, Country",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.dev",
    },
    education: [
      {
        degree: "B.Sc. Computer Science",
        institution: "ABC University",
        startDate: "2018",
        endDate: "2022",
        fieldOfStudy: "Software Engineering",
        description: "Graduated with honors, specialized in web technologies.",
      },
    ],
    experience: [
      {
        position: "Frontend Developer",
        company: "Tech Corp",
        startDate: "2022",
        endDate: "Present",
        description:
          "Building scalable web applications using React and Next.js.",
        achievements: [
          "Implemented reusable component library",
          "Improved site performance by 30%",
        ],
      },
    ],
    skills: [
      { name: "React", level: 9 },
      { name: "Next.js", level: 8 },
      { name: "TypeScript", level: 8 },
      { name: "Node.js", level: 7 },
    ],
    projects: [
      {
        name: "Portfolio Website",
        description: "A personal portfolio showcasing projects and blogs.",
        technologies: "React, Tailwind CSS, Next.js",
        link: "https://johndoe.dev",
      },
    ],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Spanish", proficiency: "Intermediate" },
    ],
    certifications: [
      { name: "AWS Certified Developer", issuer: "Amazon", date: "2023" },
    ],
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <CVEditor
          cvData={editingCV}
          onSave={handleCloseEditor}
          onCancel={handleCloseEditor}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <button
            onClick={handleNewCV}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New CV
          </button>
        </div>

        {isLoading && <p>Loading your CVs...</p>}
        {error && <p className="text-red-500">Error loading CVs</p>}

        {/* Show all CV previews in a vertical column */}
        {!isLoading && !error && (
          <div className="flex flex-col gap-6 mb-12">
            {(cvs && cvs.length > 0 ? cvs : [dummyCV]).map(
              (cv: any, index: number) => (
                <div
                  key={cv._id || index}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {cv.personalInfo.name}'s CV
                    </h3>
                    <CVPreview data={cv} />
                  </div>
                  <div className="mt-4 flex space-x-2 justify-end">
                    {cvs && cvs.length > 0 && (
                      <>
                        <button
                          onClick={() => handleEdit(cv)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cv._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {!isLoading && cvs && cvs.length === 0 && (
          <div className=" py-12">
            <p className="text-gray-500 mb-4">
              You don't have any CVs yet. Start editing the sample template:
            </p>
            <button
              onClick={handleNewCV}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start Editing This Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
