import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { 
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, 
  ApexTooltip, ApexStroke, ApexYAxis, ApexPlotOptions, ApexLegend, ApexFill 
} from 'ng-apexcharts';
import { IMetricsDataResponse } from '../../data/interfaces/imetrics-data-response.interface';
import { MetricsService } from '../../data/services/metrics.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-doctor-view',
  templateUrl: './doctor-view.component.html',
  styleUrls: ['./doctor-view.component.scss']
})
export class DoctorViewComponent implements OnInit {
  public areaChartOptions: Partial<ChartOptions>;
  public radialChartOptions: Partial<ChartOptions>;
  
  stats: any;
  appointments: any[] = [];
  doctors: any[] = [];
  patientGroups: any[] = [];
  public clinical: IMetricsDataResponse['clinical'];
  //public clinical: any = null;
  
  isLoading = true;

  constructor(private metricsService: MetricsService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.initChartConfigs();
  }

  ngOnInit() {
    this.syncMetrics();
  }

  private syncMetrics() {
    this.isLoading = true;
    this.metricsService.getMetrics().subscribe({
      next: (res: any) => {
        // 💡 Log the raw response to your browser console (F12) 
        // to see exactly what the backend is sending.
        console.log('Backend Data Received:', res);

        // Your BaseApiService likely wraps data in a 'data' property
        const data = res?.data ? res.data : res;

        if (data && data.clinical) {
          this.clinical = data.clinical;
          this.mapCharts(data.clinical.charts);
        } else {
          console.error('Clinical property not found in API response. Check backend controller.');
        }
        
        this.isLoading = false;
        this.cd.detectChanges(); // 💡 Force UI update
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error loading Metrics', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  private mapCharts(charts: any) {
    if (!charts) return;

    // We re-assign the whole object to trigger ApexCharts refresh
    this.areaChartOptions = {
      ...this.areaChartOptions,
      series: [
        { name: 'New Patients', data: charts.patientSurvey?.newPatients || [] },
        { name: 'Recovered', data: charts.patientSurvey?.recovered || [] }
      ],
      xaxis: { 
        categories: charts.patientSurvey?.labels || [] 
      }
    };

    this.radialChartOptions = {
      ...this.radialChartOptions,
      series: charts.appointmentReview?.series || [],
      labels: charts.appointmentReview?.labels || []
    };
  }

  private initChartConfigs() {
    this.areaChartOptions = {
      chart: { type: 'area', height: 350, toolbar: { show: false } },
      colors: ['#001f3f', '#23bdb8'],
      stroke: { curve: 'smooth', width: 2 },
      series: [], // Start empty
      xaxis: { categories: [] }
    };

    this.radialChartOptions = {
      chart: { type: 'radialBar', height: 320 },
      series: [],
      labels: []
    };
  }
}