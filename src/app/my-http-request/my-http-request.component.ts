import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'my-http-request',
  templateUrl: './my-http-request.compnent.html'
})
export class MyHttpRequestComponent {
  data: Object;

  constructor( private  httpClient: HttpClient) {

  }

  loadDataFromUrl(): void{
    this.httpClient.get('https://jsonplaceholder.typicode.com/posts/4')
      .subscribe((data) => {
        this.data = data;
      })
    console.log("data loaded...");
  }

}
