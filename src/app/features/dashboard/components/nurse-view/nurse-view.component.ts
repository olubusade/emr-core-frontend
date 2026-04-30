import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { 
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, 
  ApexTooltip, ApexStroke, ApexYAxis, ApexPlotOptions, ApexLegend, 
  ApexNonAxisChartSeries, ApexFill 
} from 'ng-apexcharts';
import { MetricsService } from '../../data/services/metrics.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
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
  selector: 'app-nurse-view',
  templateUrl: './nurse-view.component.html',
  styleUrls: ['./nurse-view.component.sass']
})
export class NurseViewComponent implements OnInit {
  public areaChartOptions: Partial<ChartOptions>;
  public radialChartOptions: Partial<ChartOptions>;
  public linechartOptions: Partial<ChartOptions>;
  
  public nurseData: any = null; // Points to res.data.nurse
  public totals: any = null;
  public isLoading = true;

  constructor(
    private metricsService: MetricsService,
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
        const data = res?.data || res;
        if (data && data.nurse) {
          this.nurseData = data.nurse;
          this.totals = data; 
          this.mapCharts(data);
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err?.message || 'Error loading staff list', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.cd.detectChanges();
      }
    });
  }

  private mapCharts(data: any) {
    const charts = data.nurse?.charts || data.clinical?.charts;
    const trend = data.monthlyPatientTrend || [];

    if (charts) {
      this.areaChartOptions = {
        ...this.areaChartOptions,
        series: [
          { name: 'New Patients', data: charts.patientSurvey?.newPatients || [] },
          { name: 'Old Patients', data: charts.patientSurvey?.recovered || [] }
        ],
        xaxis: { categories: charts.patientSurvey?.labels || [] }
      };

      this.radialChartOptions = {
        ...this.radialChartOptions,
        series: charts.appointmentReview?.series || [],
        labels: charts.appointmentReview?.labels || []
      };
    }

    if (trend.length > 0) {
      this.linechartOptions = {
        ...this.linechartOptions,
        series: [{
          name: 'Total Visits',
          data: trend.map((t: any) => t.count || t.visits || 0)
        }],
        xaxis: {
          categories: trend.map((t: any) => t.month || '')
        }
      };
    }
  }

  private initChartConfigs() {
    this.areaChartOptions = {
      chart: { type: 'area', height: 350, toolbar: { show: false }, foreColor: "#9aa0ac" },
      colors: ["#7D4988", "#66BB6A"],
      stroke: { curve: 'smooth' },
      dataLabels: { enabled: false },
      series: []
    };

    this.radialChartOptions = {
      chart: { type: 'radialBar', height: 265 },
      colors: ["#ffc107", "#3f51b5", "#8bc34a"],
      series: []
    };

    this.linechartOptions = {
      chart: { type: 'bar', height: 350, toolbar: { show: false }, foreColor: "#9aa0ac" },
      colors: ["#5C9FFB"],
      plotOptions: { bar: { columnWidth: '55%', borderRadius: 5 } },
      series: []
    };
  }
}