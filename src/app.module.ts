import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { CitasModule } from "./citas/citas.module";

@Module({
  imports: [AuthModule, ChatModule, CitasModule],
})
export class AppModule {}
