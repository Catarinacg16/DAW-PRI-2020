
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX 8

struct edge {
		int dest;
		struct edge *next;
};

typedef struct edge* Graph[MAX];


int valid_path(Graph g, int path[], int n) {
		int i,  found;
		struct edge *aux;
		for(i = 1; i < n; i++) {
			for(found = 0, aux = g[i-1]; aux != NULL; aux = aux->next) {
					if(aux->dest == path[i])
							found = 1;
			}
			if (found == 0)
					return 0;
		}
		return 1;
}

void shift(int u[], int n, int k) {
		int aux, i; 
		while(k > 0) {
				i = n - 1;
				aux = u[i];
				while( i > 0 ) {
						u[i-1] = u[i];
						i = i - 1;
				}
				u[0] = aux;
				k = k - 1;
		}
}

int main () {
		return 0;
}
