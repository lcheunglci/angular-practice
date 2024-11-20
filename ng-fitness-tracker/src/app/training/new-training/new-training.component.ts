import { Exercise } from './../exercise.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrl: './new-training.component.css',
})
export class NewTrainingComponent implements OnInit {
  @Output() trainingStart = new EventEmitter<void>();
  exercises$!: Observable<any>;

  constructor(
    private trainingService: TrainingService,
    private db: Firestore
  ) {}

  ngOnInit(): void {
    const itemCollection = collection(this.db, 'availableExercises');
    this.exercises$ = collectionData(itemCollection);
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
