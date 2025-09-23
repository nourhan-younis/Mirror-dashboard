import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project, ProjectResponse, ProjectsService } from '../../core/services/pojects.service';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CategoriesService, Category } from '../../core/services/categories.service';

@Component({
  selector: 'app-projects-component',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    ProjectDialogComponent
  ],
  templateUrl: './projects-component.component.html',
  styleUrl: './projects-component.component.scss'
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'description',
    'location',
    'customerName',
    'projectCost',
    'projectTime',
    'category',
    'actions',

  ];

  dataSource = new MatTableDataSource<Project>();
  total = 0;
  pageSize = 5;
  pageIndex = 0;
  selectedCategory?: string;

  categories: Category[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private projectsService: ProjectsService,
    private categoriesService: CategoriesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadCategories();
  }

  loadProjects(): void {
    this.projectsService.getAll(this.pageIndex + 1, this.pageSize, this.selectedCategory).subscribe({
      next: (res: ProjectResponse) => {
        this.dataSource.data = res.projects;
        this.total = res.total;
      },
      error: () => this.snackBar.open('Failed to load projects', 'Close', { duration: 3000 })
    });
  }

  loadCategories(): void {
  this.categoriesService.getAll().subscribe({
    next: (res) => { this.categories = res; },
    error: () => this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 })
  });
}

  pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProjects();
  }

addProject(): void {
  const dialogRef = this.dialog.open(ProjectDialogComponent, {
    width: '700px',
    data: {categories:this.categories},
  });

  dialogRef.afterClosed().subscribe(async (result) => {
    if (result) {
      let imagePaths: string[] = [];
      if (result.files?.length) {
        imagePaths = await this.projectsService.uploadFiles(result.files);
      }
      const project: Project = {
        ...result,
        images: imagePaths,
      };
      this.projectsService.create(project).subscribe({
        next: () => {
          this.snackBar.open('Project added', 'Close', { duration: 3000 });
          this.loadProjects();
        },
        error: () => this.snackBar.open('Failed to add', 'Close', { duration: 3000 }),
      });
    }
  });
}

editProject(project: Project): void {
  const dialogRef = this.dialog.open(ProjectDialogComponent, {
    width: '700px',
    data: {project,categories:this.categories},
  });

  dialogRef.afterClosed().subscribe(async (result) => {
    if (result) {
      let imagePaths: string[] = result.images || [];
      if (result.files?.length) {
        const uploaded = await this.projectsService.uploadFiles(result.files);
        imagePaths = [...imagePaths, ...uploaded];
      }
      const updatedProject: Project = {
        ...result,
        images: imagePaths,
      };
      this.projectsService.update(project._id!, updatedProject).subscribe({
        next: () => {
          this.snackBar.open('Project updated', 'Close', { duration: 3000 });
          this.loadProjects();
        },
        error: () => this.snackBar.open('Failed to update', 'Close', { duration: 3000 }),
      });
    }
  });
}


  deleteProject(project: Project): void {
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      this.projectsService.delete(project._id!).subscribe({
        next: () => {
          this.snackBar.open('Project deleted', 'Close', { duration: 2000 });
          this.loadProjects();
        },
        error: () => this.snackBar.open('Failed to delete', 'Close', { duration: 3000 })
      });
    }
  }

  private buildFormData(data: any): Project {
    const formData : Project = {
      images: [],
      name: '',
      location: '',
      customerName: '',
      projectCost: 0,
      projectTime: '',
      scopeOfWork: '',
      description: ''
    };
    formData.name = data.name ;
    formData.location = data.location ;
    formData.customerName = data.customerName ;
    formData.projectCost = data.projectCost ;
    formData.projectTime = data.projectTime ;
    formData.scopeOfWork = data.scopeOfWork ;
    formData.category = data.category ;
   formData.description = data.description ;
     console.log(data.images);
      formData.images = [data.images[0]]  // 
   


    return formData;
  }
}
