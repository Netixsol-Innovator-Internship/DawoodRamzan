export default function CVPreview({ data }: { data: any }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md overflow-y-auto max-h-[90vh]">
      <h2 className="text-3xl font-bold mb-2">{data?.personalInfo?.name}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {data?.personalInfo?.email && (
          <p className="text-gray-700">{data.personalInfo.email}</p>
        )}
        {data?.personalInfo?.phone && (
          <p className="text-gray-700">{data.personalInfo.phone}</p>
        )}
        {data?.personalInfo?.address && (
          <p className="text-gray-700">{data.personalInfo.address}</p>
        )}
        {data?.personalInfo?.linkedin && (
          <p className="text-gray-700">{data.personalInfo.linkedin}</p>
        )}
        {data?.personalInfo?.website && (
          <p className="text-gray-700">{data.personalInfo.website}</p>
        )}
      </div>
      <hr className="my-4" />

      {data?.education && data.education.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">Education</h3>
          {data.education.map((edu: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">
                {edu.degree} - {edu.institution}
              </p>
              <p className="text-sm text-gray-600">
                {edu.startDate} - {edu.endDate || "Present"}
              </p>
              {edu.fieldOfStudy && (
                <p className="text-sm">{edu.fieldOfStudy}</p>
              )}
              {edu.description && <p>{edu.description}</p>}
            </div>
          ))}
          <hr className="my-4" />
        </>
      )}

      {/* {data?.experience && data.experience.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">Experience</h3>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">
                {exp.position} - {exp.company}
              </p>
              <p className="text-sm text-gray-600">
                {exp.startDate} - {exp.endDate || "Present"}
              </p>
              {exp.description && <p>{exp.description}</p>}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc pl-5 mt-2">
                  {exp.achievements.map((ach: string, j: number) => (
                    <li key={j}>{ach}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <hr className="my-4" />
        </>
      )} */}

      {data?.experience && data.experience.length > 0 && (
  <>
    <h3 className="text-xl font-semibold mb-2">Experience</h3>
    {data.experience.map((exp: any, i: number) => {
      // Ensure achievements is always an array
      let achievements: string[] = [];
      if (Array.isArray(exp.achievements)) {
        achievements = exp.achievements;
      } else if (typeof exp.achievements === "string") {
        achievements = exp.achievements
          .split("\n")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }

      return (
        <div key={i} className="mb-3">
          <p className="font-semibold">
            {exp.position} - {exp.company}
          </p>
          <p className="text-sm text-gray-600">
            {exp.startDate} - {exp.endDate || "Present"}
          </p>
          {exp.description && <p>{exp.description}</p>}
          {achievements.length > 0 && (
            <ul className="list-disc pl-5 mt-2">
              {achievements.map((ach, j) => (
                <li key={j}>{ach}</li>
              ))}
            </ul>
          )}
        </div>
      );
    })}
    <hr className="my-4" />
  </>
)}


      {data?.skills && data.skills.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">Skills</h3>
          <ul className="list-disc pl-5">
            {data.skills.map((s: any, i: number) => (
              <li key={i}>
                {s.name} {s.level && `(${s.level}/10)`}
              </li>
            ))}
          </ul>
          <hr className="my-4" />
        </>
      )}

      {data?.projects && data.projects.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">Projects</h3>
          {data.projects.map((proj: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">{proj.name}</p>
              {proj.description && <p>{proj.description}</p>}
              {proj.technologies && (
                <p className="text-sm">Technologies: {proj.technologies}</p>
              )}
              {proj.link && (
                <p className="text-sm">
                  Link:{" "}
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    {proj.link}
                  </a>
                </p>
              )}
            </div>
          ))}
          <hr className="my-4" />
        </>
      )}

      {data?.languages && data.languages.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">Languages</h3>
          <ul className="list-disc pl-5">
            {data.languages.map((lang: any, i: number) => (
              <li key={i}>
                {lang.language} {lang.proficiency && `(${lang.proficiency})`}
              </li>
            ))}
          </ul>
          <hr className="my-4" />
        </>
      )}

      {data?.certifications && data.certifications.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">Certifications</h3>
          <ul className="list-disc pl-5">
            {data.certifications.map((cert: any, i: number) => (
              <li key={i}>
                {cert.name} - {cert.issuer} {cert.date && `(${cert.date})`}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
