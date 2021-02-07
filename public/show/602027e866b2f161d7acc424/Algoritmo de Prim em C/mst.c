#include <stdlib.h>
#include <stdio.h>

#define MAXVERTICES 100

struct _node_ {
  int dest_node;
  int weight;
  struct _node_ *next;
};

typedef struct _node_ node;

typedef node* Graph[MAXVERTICES];

#define INTREE 0
#define FRINGE 1
#define UNSEEN 2



void mst(Graph g, int n)
{
  int status[MAXVERTICES];
  int parent[MAXVERTICES];
  int fringeLink[MAXVERTICES];
  int fringeWgt[MAXVERTICES];
  node *ptr;
  int x,y;
  int fringeList;
  int edgeCount;
  int stuck;
  int sum;

  /* inicializacao */

  x = 1; 
  status[1] = INTREE;
  edgeCount = 0;
  fringeList = 0;
  for (y = 2 ; y <= n ; y++) status[y] = UNSEEN;
  stuck = 0;
  
  while(edgeCount<n-1 && (!stuck)) {

    /* atravessar lista de adjacencias de x */
    ptr = g[x];
    while(ptr) {
      y = ptr->dest_node;
      if (status[y]==FRINGE && ptr->weight<fringeWgt[y]) {
	/* substituir arco candidato de y por xy */
	parent[y] = x;
	fringeWgt[y] = ptr->weight;
      }
      else if (status[y]==UNSEEN) {
	/* y esta' na orla; xy e' arco candidato */
	status[y] = FRINGE;
	fringeLink[y] = fringeList;
	fringeList = y;
	parent[y] = x;
	fringeWgt[y] = ptr->weight;
      }
      ptr = ptr->next;
    } /* while(ptr) */

    /* escolher proximo vertice e arco para a arvore */
    if (fringeList==0) stuck = 1;
    else {
      int prev = 0;
      x = fringeList;
      for (y=fringeList; fringeLink[y]; y=fringeLink[y]) 
	if (fringeWgt[fringeLink[y]] < fringeWgt[x]) {
	  x = fringeLink[y];
	  prev = y;
	}
      if (x==fringeList) fringeList = fringeLink[x];
      else fringeLink[prev] = fringeLink[x];
      fringeLink[x] = 0;
      status[x] = INTREE;
      edgeCount++;
    }
  } /* while(edgeCount) */

  for (x=2, sum=0 ; x<=n ; x++) {
      printf("\n\t%d--%d, peso %d", x, parent[x], fringeWgt[x]);
      sum+=fringeWgt[x];  
  }
  printf("\n\n\tSum = %d\n", sum);
}



main()
{
  Graph g;
  node *new, *p;

  new = malloc(sizeof(node));
  new->next = NULL;
  new->dest_node = 2;
  new->weight = 2;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 6;
  new->weight = 7;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 7;
  new->weight = 3;
  p = new;
  
  g[1] = p;


  new = (node*) malloc(sizeof(node));
  new->next = NULL;
  new->dest_node = 1;
  new->weight = 2;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 3;
  new->weight = 4;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 7;
  new->weight = 6;
  p = new;
  
  g[2] = p;


  new = (node*) malloc(sizeof(node));
  new->next = NULL;
  new->dest_node = 2;
  new->weight = 4;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 4;
  new->weight = 2;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 8;
  new->weight = 2;
  p = new;
  
  g[3] = p;


  new = (node*) malloc(sizeof(node));
  new->next = NULL;
  new->dest_node = 3;
  new->weight = 2;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 5;
  new->weight = 1;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 8;
  new->weight = 8;
  p = new;
  
  g[4] = p;


  new = (node*) malloc(sizeof(node));
  new->next = NULL;
  new->dest_node = 4;
  new->weight = 1;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 6;
  new->weight = 6;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 9;
  new->weight = 2;
  p = new;
  
  g[5] = p;


  new = (node*) malloc(sizeof(node));
  new->next = NULL;
  new->dest_node = 1;
  new->weight = 7;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 5;
  new->weight = 6;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 9;
  new->weight = 5;
  p = new;
  
  g[6] = p;


  new = (node*) malloc(sizeof(node));
  new->next = NULL;
  new->dest_node = 1;
  new->weight = 3;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 2;
  new->weight = 6;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 8;
  new->weight = 3;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 9;
  new->weight = 1;
  p = new;
  
  g[7] = p;


  new = (node*) malloc(sizeof(node));
  new->next = NULL;
  new->dest_node = 3;
  new->weight = 2;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 4;
  new->weight = 8;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 7;
  new->weight = 3;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 9;
  new->weight = 4;
  p = new;
  
  g[8] = p;


  new = (node*) malloc(sizeof(node));
  new->next = NULL;
  new->dest_node = 5;
  new->weight = 2;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 6;
  new->weight = 5;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 7;
  new->weight = 1;
  p = new;
  
  new = malloc(sizeof(node));
  new->next = p;
  new->dest_node = 8;
  new->weight = 4;
  p = new;
  
  g[9] = p;


  mst(g,9);
}


