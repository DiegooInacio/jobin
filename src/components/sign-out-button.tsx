import { signOut } from "@/modules/auth/actions";
import { AuthSubmit } from "./auth-submit";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <AuthSubmit pendingText="Saindo..." className="sign-out-button">
        Sair
      </AuthSubmit>
    </form>
  );
}
