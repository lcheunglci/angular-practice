import { Exercise } from './../exercise.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import {
  Firestore,
  collectionData,
  collection,
  collectionSnapshots,
} from '@angular/fire/firestore';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrl: './new-training.component.css',
})
export class NewTrainingComponent implements OnInit {
  @Output() trainingStart = new EventEmitter<void>();
  exercises$!: Observable<Exercise[]>;

  constructor(
    private trainingService: TrainingService,
    private db: Firestore
  ) {}

  ngOnInit(): void {
    const itemCollection = collection(this.db, 'availableExercises');
    this.exercises$ = collectionSnapshots(itemCollection).pipe(
      map((docArray) => {
        return docArray.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          } as Exercise;
        });
      })
    );
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
