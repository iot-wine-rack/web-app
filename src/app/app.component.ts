import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Wine {
  id: string;
  name: string;
  type: string;
  color: string;
  year: string;
  light_status: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  items$: Observable<any[]>;
  items: any;
  displayedColumns: string[] = ['name', 'type', 'color', 'year', 'light'];
  dataSource: Wine[];
  winesCollectionRef: AngularFirestoreCollection<Wine>;

  constructor(private afs: AngularFirestore) {
    this.winesCollectionRef = afs.collection<Wine>('/users/user-1/racks/rack-2/wines');
    this.items$ = this.winesCollectionRef.snapshotChanges().pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Wine;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      }));
  }
  ngOnInit(): void {
    this.items$.subscribe(val => {
      this.dataSource = val;
    });
  }

  toggleLight(wine: Wine): void {
    this.winesCollectionRef.doc(wine.id).update({ light_status: !wine.light_status});
  }
}
