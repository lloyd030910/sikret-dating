import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModelProfile } from './entities/model-profile.entity';
import { Assignment } from './entities/assignment.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(ModelProfile)
    private modelProfileRepository: Repository<ModelProfile>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async assignModel(admin: User, employeeId: string, modelId: string): Promise<Assignment> {
    const employee = await this.userRepository.findOne({ where: { id: employeeId, role: UserRole.EMPLOYEE } });
    if (!employee) throw new NotFoundException('Employee not found');

    const model = await this.userRepository.findOne({ where: { id: modelId, role: UserRole.MODEL } });
    if (!model) throw new NotFoundException('Model not found');

    const existing = await this.assignmentRepository.findOne({
      where: { employee: { id: employeeId }, model: { id: modelId } },
    });
    if (existing) return existing;

    const assignment = this.assignmentRepository.create({
      employee,
      model,
      assignedBy: admin,
    });
    return this.assignmentRepository.save(assignment);
  }

  async getEmployeeModels(employeeId: string): Promise<User[]> {
    const assignments = await this.assignmentRepository.find({
      where: { employee: { id: employeeId }, isActive: true },
      relations: ['model', 'model.profile'],
    });
    return assignments.map(a => a.model);
  }

  async isAssigned(employeeId: string, modelId: string): Promise<boolean> {
    const count = await this.assignmentRepository.count({
      where: { employee: { id: employeeId }, model: { id: modelId }, isActive: true },
    });
    return count > 0;
  }
}
