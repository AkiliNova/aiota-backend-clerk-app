import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "user"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "tenant"
    | "cameraZone"
    | "camera"
    | "surveillanceEvent"
    | "flaggedEvent"
    | "security"
    | "aiModel"
    | "device"
    | "dvr"
    | "nvr"
    | "accessControlDevice"
    | "visitorLog";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
  onCreate?: () => void;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData: Record<string, any> = {};

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "user": {
        const users = await prisma.user.findMany({
          select: { id: true, email: true, name: true, role: true },
        });
        relatedData = { users };
        break;
      }

      case "camera": {
        const zones = await prisma.zone.findMany({
          select: { id: true, name: true },
        });
        relatedData = { zones };
        break;
      }
      case "surveillanceEvent": {
        const cameras = await prisma.camera.findMany({
          select: { id: true, ipAddress: true },
        });
        relatedData = { cameras };
        break;
      }
      case "flaggedEvent": {
        const events = await prisma.aiEvent.findMany({
          select: { id: true, timestamp: true, eventType: true },
        });
        relatedData = { events };
        break;
      }
      case "aiModel": {
        const tenants = await prisma.tenant.findMany({
          select: { id: true, name: true },
        });
        relatedData = { tenants };
        break;
      }
      case "accessControlDevice": {
        const tenants = await prisma.tenant.findMany({
          select: { id: true, name: true },
        });
        relatedData = { tenants };
        break;
      }
      case "security": {
        const tenants = await prisma.tenant.findMany({
          select: { id: true, name: true },
        });
        relatedData = { tenants };
        break;
      }
      case "device": {
        const tenants = await prisma.tenant.findMany({
          select: { id: true, name: true },
        });
        relatedData = { tenants };
        break;
      }
      case "nvr":
      case "dvr": {
        const tenants = await prisma.tenant.findMany({
          select: { id: true, name: true },
        });
        relatedData = { tenants };
        break;
      }
      case "visitorLog": {
        const tenants = await prisma.tenant.findMany({
          select: { id: true, name: true },
        });
        relatedData = { tenants };
        break;
      }

      // Add more cases if needed — e.g. parent, announcement, etc.

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
