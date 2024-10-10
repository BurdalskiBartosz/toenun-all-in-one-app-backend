import { Module } from '@nestjs/common';
import { NotesController } from '../Infrastucture/Controllers/NotesController';
import { NotesRepository } from '../Infrastucture/Database/Repository/NotesRepository';
import { PrismaService } from 'src/prisma.service';
import { GetNotes } from '../Infrastucture/Database/Query/GetNotes';
import { CreateNote } from '../Application/UseCases/CreateNote';

const useCases = [CreateNote];

const queries = [GetNotes];

@Module({
  controllers: [NotesController],
  providers: [NotesRepository, PrismaService, ...useCases, ...queries],
})
export class NotesModule {}
