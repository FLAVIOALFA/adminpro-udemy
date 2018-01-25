import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  public label: string = '';

  constructor( public _router: Router,
               public _title: Title,
               public _meta: Meta
             ) {
      
          this.getDataRoute()
          .subscribe(
            data => {
            this.label = data.titulo;
            this._title.setTitle(this.label);

            let metaTag: MetaDefinition = {
              name : 'description',
              content: this.label
            };

            this._meta.updateTag(metaTag);


          });
  }

  getDataRoute() {
    return this._router.events
          .filter( (event: ActivationEnd) => event instanceof ActivationEnd)
          .filter( (event: ActivationEnd) => event.snapshot.firstChild === null )
          .map( (event: ActivationEnd) => event.snapshot.data);
  }

  ngOnInit() {
  }

}
