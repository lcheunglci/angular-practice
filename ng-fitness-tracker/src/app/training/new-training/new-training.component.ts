import { Exercise } from './../exercise.model';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrl: './new-training.component.css',
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() trainingStart = new EventEmitter<void>();
  exercises!: Exercise[];
  exerciseSub!: Subscription;
  isLoading = false;

  constructor(private trainingService: TrainingService) {}

  ngOnDestroy(): void {
    this.exerciseSub.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.exerciseSub = this.trainingService.exercisesChanged.subscribe(
      (exercises) => {
        this.exercises = exercises;
        this.isLoading = false;
      }
    );
    this.fetchExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
}
