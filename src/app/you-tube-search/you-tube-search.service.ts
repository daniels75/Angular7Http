import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { SearchResult } from './search-result.model';

/*
  This API key may or may not work for you. Your best bet is to issue your own
  API key by following these instructions:
  https://developers.google.com/youtube/registering_an_application#Create_API_Keys

  Here I've used a **server key** and make sure you enable YouTube.

  Note that if you do use this API key, it will only work if the URL in
  your browser is "localhost"
*/
export const YOUTUBE_API_KEY =
  'AIzaSyDOfT_BO81aEZScosfTYMruJobmpjqNeEk';
export const YOUTUBE_API_URL =
  'https://www.googleapis.com/youtube/v3/search';

/**
 * YouTubeService connects to the YouTube API
 * See: * https://developers.google.com/youtube/v3/docs/search/list
 */
@Injectable()
export class YouTubeSearchService {
  constructor(
    private http: HttpClient,
    @Inject(YOUTUBE_API_KEY) private apiKey: string,
    @Inject(YOUTUBE_API_URL) private apiUrl: string
  ) {}

  search(query: string): Observable<SearchResult[]> {
    const params: string = [
      `q=${query}`,
      `key=${this.apiKey}`,
      `part=snippet`,
      `type=video`,
      `maxResults=10`
    ].join('&');
    const queryUrl = `${this.apiUrl}?${params}`;

    // where we have 2 observable
    let getObs: Observable<any> = this.http.get(queryUrl);
    let responseObs: Observable<SearchResult[]> = getObs.map((res:any) => {
        // here res['items'] is an Observer with SearchResult[]
        // without res['items'] it will not work since  then
        // it will be an Observable<void>
      console.log('>>>> test1');
      let map =  res['items'].map(item => {
          let result: SearchResult = new SearchResult({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high.url
          })

          console.log('single item: ', result);

          // this maps from single item -> SearchResult
          // and then return a single SearchResult
          return result;
        });
      return map;
      }
    );

    // subscription is needed if we would like to see any results from observable
     responseObs.subscribe(item => {
      console.log('>>>> Simple observer', item);
    });

    console.log('after map');

    let result: Observable<SearchResult[]> =
      this.http.get(queryUrl).map((res: any) => {
      return res['items'].map(item => {
        console.log("raw item", item); // uncomment if you want to debug
        let singleResult: SearchResult =  new SearchResult({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.high.url
        });
        return singleResult;
      });
    });

    return responseObs;
  }
}
