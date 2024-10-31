import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { InformesModule } from "./informes/informes.module";
import { CitasModule } from "./citas/citas.module";

@Module({
  imports: [AuthModule, ChatModule, InformesModule, CitasModule],
})
export class AppModule {}
