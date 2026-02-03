// import {
//   GoogleMap,
//   InfoWindow,
//   Marker,
//   useLoadScript,
// } from "@react-google-maps/api";
// import { MailIcon, MessageSquareIcon, PhoneIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useMemo, useState } from "react";
// import { EditJobDialog } from "./edit-job-dialog";

// const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

// function getPriorityColor(priority: string) {
//   switch (priority) {
//     case "High":
//       return "bg-red-100 text-red-700";
//     case "Medium":
//       return "bg-yellow-100 text-yellow-700";
//     case "Low":
//       return "bg-green-100 text-green-700";
//     case "Urgent":
//       return "bg-orange-100 text-orange-700";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// }

// function getStatusColor(status: string) {
//   switch (status) {
//     case "Initiated":
//       return "bg-blue-100 text-blue-700";
//     case "Quotation":
//       return "bg-purple-100 text-purple-700";
//     case "Approved":
//       return "bg-green-100 text-green-700";
//     case "In Progress":
//       return "bg-yellow-100 text-yellow-700";
//     case "Completed":
//       return "bg-gray-100 text-gray-700";
//     case "Invoiced":
//       return "bg-cyan-100 text-cyan-700";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// }

// export function JobMapView({ jobs }: { jobs: any[] }) {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//   });
//   const [selectedJob, setSelectedJob] = useState<any | null>(null);
//   const router = useRouter();

//   const center = useMemo(() => {
//     if (
//       jobs.length > 0 &&
//       jobs[0].address?.latitude &&
//       jobs[0].address?.longitude
//     ) {
//       return {
//         lat: jobs[0].address.latitude,
//         lng: jobs[0].address.longitude,
//       };
//     }
//     return { lat: 24.8607, lng: 67.0011 };
//   }, [jobs]);

//   if (!isLoaded) return <div>Loading map...</div>;

//   return (
//     <div style={{ width: "100%", height: 600 }}>
//       <GoogleMap
//         mapContainerStyle={{ width: "100%", height: "100%" }}
//         center={center}
//         zoom={jobs.length > 0 ? 10 : 3}
//       >
//         {jobs.map((job, idx) =>
//           job.address?.latitude && job.address?.longitude ? (
//             <Marker
//               key={job.id}
//               position={{
//                 lat: job.address.latitude,
//                 lng: job.address.longitude,
//               }}
//               onClick={() => setSelectedJob(job)}
//               label={{
//                 text: `${idx + 1}`,
//                 color: "#fff",
//                 fontWeight: "bold",
//                 fontSize: "16px",
//               }}
//               icon={{
//                 path: google.maps.SymbolPath.CIRCLE,
//                 scale: 20,
//                 fillColor: "#06b6d4",
//                 fillOpacity: 1,
//                 strokeWeight: 2,
//                 strokeColor: "#0369a1",
//               }}
//             />
//           ) : null
//         )}
//         {selectedJob && (
//           <InfoWindow
//             position={{
//               lat: selectedJob.address.latitude,
//               lng: selectedJob.address.longitude,
//             }}
//             onCloseClick={() => setSelectedJob(null)}
//           >
//             <div style={{ minWidth: 340, maxWidth: 440 }}>
//               <div className="font-bold text-lg mb-2">
//                 {selectedJob.jobTitle}
//               </div>
//               <div className="flex gap-2 mb-2">
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
//                     selectedJob.status
//                   )}`}
//                 >
//                   {selectedJob.status}
//                 </span>
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(
//                     selectedJob.priority
//                   )}`}
//                 >
//                   {selectedJob.priority}
//                 </span>
//               </div>
//               <div className="text-sm text-muted-foreground mb-2">
//                 <b>Address:</b> {selectedJob.address?.formattedAddress}
//               </div>
//               <div className="text-sm mb-1">
//                 <b>Job #:</b> {selectedJob.jobNumber} <br />
//                 <b>Due Date:</b>{" "}
//                 {selectedJob.dueDate
//                   ? new Date(selectedJob.dueDate).toLocaleDateString()
//                   : "-"}
//                 <br />
//                 <b>Estimated Hours:</b> {selectedJob.estimatedHours}
//                 <br />
//                 <b>Contact Phone:</b> {selectedJob.contactDetails?.phoneNumber}
//                 <br />
//                 <b>Contact Email:</b> {selectedJob.contactDetails?.email}
//                 <br />
//                 <b>Description:</b> {selectedJob.description}
//               </div>
//               <div className="flex gap-2 mt-4 flex-wrap">
//                 <EditJobDialog job={selectedJob} />
//                 {selectedJob.contactDetails?.phoneNumber && (
//                   <a
//                     href={`tel:${selectedJob.contactDetails.phoneNumber}`}
//                     className="px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition text-xs flex items-center gap-1"
//                     title="Call"
//                   >
//                     <PhoneIcon className="w-4 h-4" /> Call
//                   </a>
//                 )}
//                 {selectedJob.contactDetails?.phoneNumber && (
//                   <a
//                     href={`sms:${selectedJob.contactDetails.phoneNumber}`}
//                     className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition text-xs flex items-center gap-1"
//                     title="Message"
//                   >
//                     <MessageSquareIcon className="w-4 h-4" /> Message
//                   </a>
//                 )}
//                 {selectedJob.contactDetails?.email && (
//                   <a
//                     href={`mailto:${selectedJob.contactDetails.email}`}
//                     className="px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-xs flex items-center gap-1"
//                     title="Mail"
//                   >
//                     <MailIcon className="w-4 h-4" /> Mail
//                   </a>
//                 )}
//               </div>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     </div>
//   );
// }

import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import {
  MailIcon,
  MapPinIcon,
  MessageSquareIcon,
  PhoneIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EditJobDialog } from "./edit-job-dialog";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High":
      return "bg-red-500 text-white";
    case "Medium":
      return "bg-yellow-500 text-white";
    case "Low":
      return "bg-green-500 text-white";
    case "Urgent":
      return "bg-orange-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Initiated":
      return "bg-blue-500 text-white";
    case "Quotation":
      return "bg-purple-500 text-white";
    case "Approved":
      return "bg-green-500 text-white";
    case "In Progress":
      return "bg-yellow-500 text-white";
    case "Completed":
      return "bg-gray-500 text-white";
    case "Invoiced":
      return "bg-cyan-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

export function JobMapView({ jobs }: { jobs: any[] }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const router = useRouter();

  const center = useMemo(() => {
    if (
      jobs.length > 0 &&
      jobs[0].address?.latitude &&
      jobs[0].address?.longitude
    ) {
      return {
        lat: jobs[0].address.latitude,
        lng: jobs[0].address.longitude,
      };
    }
    return { lat: 24.8607, lng: 67.0011 };
  }, [jobs]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ width: "100%", height: 600 }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={jobs.length > 0 ? 10 : 3}
      >
        {jobs.map((job, idx) =>
          job.address?.latitude && job.address?.longitude ? (
            <Marker
              key={job.id}
              position={{
                lat: job.address.latitude,
                lng: job.address.longitude,
              }}
              onClick={() => setSelectedJob(job)}
              label={{
                text: `${idx + 1}`,
                color: "#fff",
                fontWeight: "bold",
                fontSize: "14px",
              }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 18,
                fillColor: "#06b6d4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#0369a1",
              }}
            />
          ) : null
        )}
        {selectedJob && (
          <InfoWindow
            position={{
              lat: selectedJob.address.latitude,
              lng: selectedJob.address.longitude,
            }}
            onCloseClick={() => setSelectedJob(null)}
          >
            <div className="w-80 p-1">
              {/* Header */}
              <div className="border-b border-gray-200 pb-3 mb-3">
                <h3 className="font-semibold text-gray-900 text-base mb-2 leading-tight">
                  {selectedJob.jobTitle}
                </h3>
                <div className="flex gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedJob.status
                    )}`}
                  >
                    {selectedJob.status}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      selectedJob.priority
                    )}`}
                  >
                    {selectedJob.priority}
                  </span>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm">
                  <MapPinIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 leading-tight">
                    {selectedJob.address?.formattedAddress}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Job #:</span>{" "}
                    {selectedJob.jobNumber}
                  </div>
                  <div>
                    <span className="font-medium">Hours:</span>{" "}
                    {selectedJob.estimatedHours}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Due:</span>{" "}
                    {selectedJob.dueDate
                      ? new Date(selectedJob.dueDate).toLocaleDateString()
                      : "Not set"}
                  </div>
                </div>

                {selectedJob.description && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <span className="font-medium">Description:</span>{" "}
                    {selectedJob.description}
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <div className="flex gap-1.5">
                  {selectedJob.contactDetails?.phoneNumber && (
                    <a
                      href={`tel:${selectedJob.contactDetails.phoneNumber}`}
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                      title="Call"
                    >
                      <PhoneIcon className="w-4 h-4" />
                    </a>
                  )}
                  {selectedJob.contactDetails?.phoneNumber && (
                    <a
                      href={`sms:${selectedJob.contactDetails.phoneNumber}`}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      title="Message"
                    >
                      <MessageSquareIcon className="w-4 h-4" />
                    </a>
                  )}
                  {selectedJob.contactDetails?.email && (
                    <a
                      href={`mailto:${selectedJob.contactDetails.email}`}
                      className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                      title="Email"
                    >
                      <MailIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <EditJobDialog job={selectedJob} />
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
