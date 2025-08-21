import { Alert } from "@/components/ui-elements/alert";
import { RedirectToLogin } from "./_components/client-login-btn";
export default async function Home() {
  return (
    <div className="flex flex-col justify-start">
      <div className="flex justify-center">
        <RedirectToLogin />
      </div>
      <br />
      <div>
        <Alert
          variant="warning"
          title="Stay alert!"
          description="Set your antivirus software to auto-scan every morning."
        />
        <br />
        <Alert
          variant="warning"
          title="請警惕"
          description="設定您的防毒軟體於每天早上自動掃描。"
        />
        <br />
        <Alert
          variant="warning"
          title="请警惕!"
          description="每天早上讓防毒軟體自動掃描。"
        />
      </div>
    </div>
  );
}
