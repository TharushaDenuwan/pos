import { getAllWorker } from "@/features/worker/actions/getAll.action";
import { NewWorker } from "@/features/worker/components/new-worker";
import { WorkerTable } from "@/features/worker/components/worker-table";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function WorkerPage({ searchParams }: PageProps) {
  const { page = "1", search = "" } = searchParams;
  // Fetch workers and pagination meta
  const response = await getAllWorker({ page, search });
  const workers = response.data.map((worker: any) => ({
    ...worker,
    createdAt: worker.createdAt ? new Date(worker.createdAt) : undefined,
    updatedAt: worker.updatedAt ? new Date(worker.updatedAt) : undefined,
  }));
  const { currentPage, totalPages, totalCount } = response.meta;

  return (
    <div className="container mx-auto py-8 px-3 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Worker Listings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your property listings
          </p>
        </div>
        <NewWorker />
      </div>

      <WorkerTable
        workers={workers}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
