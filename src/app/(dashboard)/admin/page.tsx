import Announcements from "@/components/Announcements";
import SurveillanceFeedSummary from "@/components/SurveillanceFeedSummary";
import DetectionStatsChart from "@/components/DetectionStatsChart";
import BehaviorAlertChart from "@/components/BehaviorAlertChart";
import AccessLogChart from "@/components/AccessLogChart";
import TruancyReportChart from "@/components/TruancyReportChart";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import UserCard from "@/components/UserCard";

const AdminPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
          <UserCard type="security" />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* OBJECT & HUMAN DETECTION */}
          <div className="w-full lg:w-1/2 h-[450px]">
            <DetectionStatsChart />
          </div>
          {/* BEHAVIOR ALERTS */}
          <div className="w-full lg:w-1/2 h-[450px]">
            <BehaviorAlertChart />
          </div>
        </div>

        {/* ACCESS + TRUANCY REPORTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 h-[450px]">
            <AccessLogChart />
          </div>
          <div className="w-full lg:w-1/2 h-[450px]">
            <TruancyReportChart />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <SurveillanceFeedSummary />
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
