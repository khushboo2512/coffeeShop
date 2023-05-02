import { Component } from '@angular/core';
import { CoffeeService } from './coffee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CoffeeShop';
  results: any;

  constructor(private coffeeService: CoffeeService) { }

  ngOnInit() {
    this.coffeeService.processData().subscribe((data: any) => {
      this.results = data;
    });
  }
}
