import { RouterModule, Routes }        from '@angular/router';
import { NgModule }                    from '@angular/core';


import { SelectivePreloadingStrategy } from './selective-preloading-strategy'

const pageRoutes: Routes = [
	{
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadChildren: './home/home.module#HomeModule',
		data: {preload: true},
    },
	{
		path: 'login',
		loadChildren: './login/login.module#LoginModule',
	},
	{
		path: 'booking',
		loadChildren: './booking/booking.module#BookingModule',
	},
	{
		path: 'workbench',
		loadChildren: './workbench/workbench.module#WorkbenchModule',
		data: {preload: true},
	},
	{
		path: 'transaction',
		loadChildren: './transaction/transaction.module#TransactionModule',
		data: {preload: true},
	}
]

@NgModule({
    imports: [
        RouterModule.forRoot(pageRoutes, {preloadingStrategy: SelectivePreloadingStrategy}),
    ],
    exports: [
        RouterModule
    ]
})

export class PageRoutingModule{

}
