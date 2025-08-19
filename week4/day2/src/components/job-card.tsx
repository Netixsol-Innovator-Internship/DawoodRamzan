"use client";

import type { Job } from "@/store/job-store";
import { useJobStore } from "@/store/job-store";
import Image from "next/image";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const addFilter = useJobStore((state) => state.addFilter);
  const filters = useJobStore((state) => state.filters);

  const allTags = [job.role, job.level, ...job.languages, ...job.tools];

  const handleTagClick = (tag: string) => {
    if (!filters.includes(tag)) {
      addFilter(tag);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 sm:p-10 mb-10 relative border-l-4 border-transparent hover:border-teal-500 hover:scale-[1.02] transition-all ease-in-out duration-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Main content area */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4 md:mb-0">
          {/* Company logo - positioned absolutely on small screens */}
          <div className="absolute -top-6 left-4 sm:relative sm:top-0 sm:left-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white sm:bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src={job.logo}
              alt={`${job.company} logo`}
              width={64}
              height={64}
              className="object-contain p-1 sm:p-0"
            />
          </div>

          <div className="flex-1 mt-6 sm:mt-0">
            {/* Company info and badges */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-teal-600 font-medium text-sm">
                {job.company}
              </span>
              <div className="flex gap-2">
                {job.new && (
                  <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap">
                    NEW!
                  </span>
                )}
                {job.featured && (
                  <span className="bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap">
                    FEATURED
                  </span>
                )}
              </div>
            </div>

            {/* Job position */}
            <h3 className="text-gray-800 font-bold text-base sm:text-lg mb-2 hover:text-teal-600 cursor-pointer">
              {job.position}
            </h3>

            {/* Job details */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-3 text-gray-500 text-sm">
              <span>{job.postedAt}</span>
              <span className="hidden sm:inline">•</span>
              <span className="after:content-['•'] after:ml-1 sm:after:content-none">
                {job.contract}
              </span>
              <span className="hidden sm:inline">•</span>
              <span>{job.location}</span>
            </div>
          </div>
        </div>

        {/* Tags section */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 sm:border-t-0 sm:pt-0">
          {allTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="bg-teal-50 text-teal-600 px-2 py-1 rounded font-medium text-xs sm:text-sm hover:bg-teal-600 hover:text-white transition-colors whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
