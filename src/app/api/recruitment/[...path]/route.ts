import { NextRequest, NextResponse } from "next/server";
import { MOCK_JOBS, MOCK_CANDIDATES } from "@/mocks/recruitment/data";
import { JobStatus, CandidateStatus } from "@/types/recruitment";

// Giả lập Database trong bộ nhớ (chỉ tồn tại khi dev server chạy)
let dbJobs = [...MOCK_JOBS];
let dbCandidates = [...MOCK_CANDIDATES];

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // 1. GET /api/recruitment/jobs (Public)
    if (path[0] === 'jobs' && path.length === 1) {
        const status = searchParams.get('status');
        let data = dbJobs;
        if (status) data = data.filter(j => j.status === status);
        return NextResponse.json({ data });
    }

    // 2. GET /api/recruitment/jobs/:slug (Public)
    if (path[0] === 'jobs' && path.length === 2) {
        const slug = path[1];
        const job = dbJobs.find(j => j.slug === slug);
        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
        return NextResponse.json({ data: job });
    }

    // 4. GET /api/recruitment/tracking/:code (Public)
    if (path[0] === 'tracking' && path.length === 2) {
        const code = path[1];
        const candidate = dbCandidates.find(c => c.trackingCode === code);
        if (!candidate) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        return NextResponse.json({ data: candidate });
    }

    // 5. GET /api/recruitment/admin/jobs (Admin List)
    if (path[0] === 'admin' && path[1] === 'jobs' && path.length === 2) {
        return NextResponse.json({ data: dbJobs, meta: { total: dbJobs.length } });
    }

    // 6. GET /api/recruitment/admin/candidates (Admin List)
    if (path[0] === 'admin' && path[1] === 'candidates' && path.length === 2) {
        const status = searchParams.get('status');
        let data = dbCandidates;
        if (status && status !== 'ALL') data = data.filter(c => c.status === status);
        return NextResponse.json({ data, meta: { total: data.length } });
    }

    return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;

    // 3. POST /api/recruitment/apply (Apply)
    if (path[0] === 'apply') {
        const formData = await req.formData();
        const jobId = formData.get('jobId') as string;
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        // Mock upload file -> url giả
        const cvUrl = "https://example.com/mock-cv.pdf";

        const job = dbJobs.find(j => j.id === jobId);

        const newCandidate = {
            id: `cand-${Date.now()}`,
            fullName,
            email,
            phone,
            cvUrl,
            status: CandidateStatus.PENDING,
            trackingCode: `REF-${Math.floor(Math.random() * 1000000)}`,
            job: job,
            submittedAt: new Date().toISOString()
        };

        dbCandidates.unshift(newCandidate);
        return NextResponse.json({
            data: { trackingCode: newCandidate.trackingCode, message: "Success" }
        });
    }

    // Admin Create Job
    if (path[0] === 'admin' && path[1] === 'jobs') {
        const body = await req.json();
        const newJob = {
            ...body,
            id: `job-${Date.now()}`,
            createdAt: new Date().toISOString(),
            description: body.description || [], // Ensure array
            requirements: body.requirements || [],
            benefits: body.benefits || []
        };
        dbJobs.unshift(newJob);
        return NextResponse.json({ data: newJob });
    }

    return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;

    // Admin Update Job
    if (path[0] === 'admin' && path[1] === 'jobs' && path[2]) {
        const id = path[2];
        const body = await req.json();
        const index = dbJobs.findIndex(j => j.id === id);
        if (index > -1) {
            dbJobs[index] = { ...dbJobs[index], ...body };
            return NextResponse.json({ data: dbJobs[index] });
        }
    }

    // Admin Update Candidate Status
    if (path[0] === 'admin' && path[1] === 'candidates' && path[2] && path[3] === 'status') {
        const id = path[2];
        const { status } = await req.json();
        const index = dbCandidates.findIndex(c => c.id === id);
        if (index > -1) {
            dbCandidates[index] = { ...dbCandidates[index], status };
            return NextResponse.json({ data: dbCandidates[index] });
        }
    }

    return NextResponse.json({ error: "Action failed" }, { status: 400 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;

    // Admin Delete Job
    if (path[0] === 'admin' && path[1] === 'jobs' && path[2]) {
        const id = path[2];
        dbJobs = dbJobs.filter(j => j.id !== id);
        return NextResponse.json({ message: "Deleted" });
    }

    return NextResponse.json({ error: "Action failed" }, { status: 400 });
}
