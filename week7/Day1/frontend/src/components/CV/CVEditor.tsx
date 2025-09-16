import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  useCreateCVMutation,
  useUpdateCVMutation,
  useLazyExportPDFQuery,
  useLazyExportDOCXQuery,
} from "@/lib/services/cvApi";
import CVPreview from "./CVPreview";

interface CVEditorProps {
  cvData?: any;
  onSave: () => void;
  onCancel: () => void;
}

export default function CVEditor({ cvData, onSave, onCancel }: CVEditorProps) {
  const [createCV] = useCreateCVMutation();
  const [updateCV] = useUpdateCVMutation();
  const [exportPDF] = useLazyExportPDFQuery();
  const [exportDOCX] = useLazyExportDOCXQuery();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: cvData || {
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        website: "",
      },
      education: [
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      experience: [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [""],
        },
      ],
      skills: [{ name: "", level: 5 }],
      projects: [
        {
          name: "",
          description: "",
          technologies: [""],
          link: "",
        },
      ],
      languages: [{ language: "", proficiency: "" }],
      certifications: [{ name: "", issuer: "", date: "" }],
    },
  });

  // Watch all form data for preview
  const watchedData = useWatch({ control });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: "certifications",
  });

const onSubmit = async (data: any) => {
  try {
    if (cvData) {
      // Correctly wrap the form data under `data`
      await updateCV({ id: cvData._id, data }).unwrap();
      console.log("Updated CV:", data);
    } else {
      await createCV(data).unwrap();
    }
    onSave();
  } catch (error) {
    console.error("Failed to save CV:", error);
  }
};


  const handleExportPDF = async () => {
    if (!cvData) return;
    try {
      const blob = await exportPDF(cvData._id).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cvData.personalInfo.name}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    }
  };

  const handleExportDOCX = async () => {
    if (!cvData) return;
    try {
      const blob = await exportDOCX(cvData._id).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cvData.personalInfo.name}_CV.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export DOCX:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {cvData ? "Edit CV" : "Create New CV"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("personalInfo.name", {
                    required: "Name is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {/* {errors.personalInfo?.name && (
                  <p className="text-red-500 text-sm">
                    {errors.personalInfo.name.message}
                  </p>
                )} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  {...register("personalInfo.email", {
                    required: "Email is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {/* {errors.personalInfo?.email && (
                  <p className="text-red-500 text-sm">
                    {errors.personalInfo.email.message}
                  </p>
                )} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register("personalInfo.phone")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  {...register("personalInfo.address")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <input
                  type="url"
                  {...register("personalInfo.linkedin")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  {...register("personalInfo.website")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Education</h3>
              <button
                type="button"
                onClick={() =>
                  appendEducation({
                    institution: "",
                    degree: "",
                    fieldOfStudy: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  })
                }
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Add Education
              </button>
            </div>
            {educationFields.map((field, index) => (
              <div
                key={field.id}
                className="mb-4 p-4 border border-gray-200 rounded-md"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Institution
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.institution`, {
                        required: "Institution is required",
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Degree
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.degree`, {
                        required: "Degree is required",
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.fieldOfStudy`)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        {...register(`education.${index}.startDate`)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        {...register(`education.${index}.endDate`)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register(`education.${index}.description`)}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Experience Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Experience</h3>
              <button
                type="button"
                onClick={() =>
                  appendExperience({
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    achievements: [""],
                  })
                }
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Add Experience
              </button>
            </div>
            {experienceFields.map((field, index) => (
              <div
                key={field.id}
                className="mb-4 p-4 border border-gray-200 rounded-md"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <input
                      type="text"
                      {...register(`experience.${index}.company`, {
                        required: "Company is required",
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <input
                      type="text"
                      {...register(`experience.${index}.position`, {
                        required: "Position is required",
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        {...register(`experience.${index}.startDate`)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        {...register(`experience.${index}.endDate`)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register(`experience.${index}.description`)}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Achievements (one per line)
                    </label>
                    <textarea
                      {...register(`experience.${index}.achievements`)}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter each achievement on a new line"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Skills</h3>
              <button
                type="button"
                onClick={() => appendSkill({ name: "", level: 5 })}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Add Skill
              </button>
            </div>
            {skillFields.map((field, index) => (
              <div key={field.id} className="mb-4 flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    {...register(`skills.${index}.name`)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700">
                    Level (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    {...register(`skills.${index}.level`, {
                      valueAsNumber: true,
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="mt-6 px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Projects</h3>
              <button
                type="button"
                onClick={() =>
                  appendProject({
                    name: "",
                    description: "",
                    technologies: [""],
                    link: "",
                  })
                }
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Add Project
              </button>
            </div>
            {projectFields.map((field, index) => (
              <div
                key={field.id}
                className="mb-4 p-4 border border-gray-200 rounded-md"
              >
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Project Name
                    </label>
                    <input
                      type="text"
                      {...register(`projects.${index}.name`)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register(`projects.${index}.description`)}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      {...register(`projects.${index}.technologies`)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Project Link
                    </label>
                    <input
                      type="url"
                      {...register(`projects.${index}.link`)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Languages Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Languages</h3>
              <button
                type="button"
                onClick={() =>
                  appendLanguage({ language: "", proficiency: "" })
                }
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Add Language
              </button>
            </div>
            {languageFields.map((field, index) => (
              <div key={field.id} className="mb-4 flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <input
                    type="text"
                    {...register(`languages.${index}.language`)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Proficiency
                  </label>
                  <select
                    {...register(`languages.${index}.proficiency`)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select proficiency</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="mt-6 px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Certifications Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Certifications</h3>
              <button
                type="button"
                onClick={() =>
                  appendCertification({ name: "", issuer: "", date: "" })
                }
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Add Certification
              </button>
            </div>
            {certificationFields.map((field, index) => (
              <div
                key={field.id}
                className="mb-4 p-4 border border-gray-200 rounded-md"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Certification Name
                    </label>
                    <input
                      type="text"
                      {...register(`certifications.${index}.name`)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Issuer
                    </label>
                    <input
                      type="text"
                      {...register(`certifications.${index}.issuer`)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      {...register(`certifications.${index}.date`)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <div className="flex gap-2">
              {cvData && (
                <>
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Export PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleExportDOCX}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Export DOCX
                  </button>
                </>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {cvData ? "Update CV" : "Create CV"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <CVPreview data={watchedData} />
    </div>
  );
}
