import { Module } from '@nestjs/common';
import { PrincipalGateway } from './principal.gateway';

@Module({
  providers: [PrincipalGateway]
})
export class GatewayModule {}
