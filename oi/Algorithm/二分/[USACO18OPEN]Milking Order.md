# [USACO18OPEN]Milking Order
[BZOJ5280 Luogu4376]

Farmer John的$N$头奶牛（$1 \leq N \leq 10^5$），仍然编号为$1 \ldots N$，正好闲得发慌。因此，她们发展了一个与Farmer John每天早上为她们挤牛奶的时候的排队顺序相关的复杂的社会阶层。  
经过若干周的研究，Farmer John对他的奶牛的社会结构总计进行了$M$次观察（$1 \leq M \leq 50,000$）。每个观察结果都是他的某些奶牛的一个有序序列，表示这些奶牛应该以与她们在序列中出现的顺序相同的顺序进行挤奶。比方说，如果Farmer John的一次观察结果是序列2、5、1，Farmer John应该在给奶牛5挤奶之前的某个时刻给奶牛2挤奶，在给奶牛1挤奶之前的某个时刻给奶牛5挤奶。  
Farmer John的观察结果是按优先级排列的，所以他的目标是最大化$X$的值，使得他的挤奶顺序能够符合前$X$个观察结果描述的状态。当多种挤奶顺序都能符合前$X$个状态时，Farmer John相信一个长期以来的传统——编号较小的奶牛的地位高于编号较大的奶牛，所以他会最先给编号最小的奶牛挤奶。更加正式地说，如果有多个挤奶顺序符合这些状态，Farmer John会采用字典序最小的那一个。挤奶顺序$x$的字典序比挤奶顺序$y$要小，如果对于某个$j$，$x_i = y_i$对所有$i &lt; j$成立，并且$x_j &lt; y_j$（也就是说，这两个挤奶顺序到某个位置之前都是完全相同的，在这个位置上$x$比$y$要小）。  
请帮助Farmer John求出为奶牛挤奶的最佳顺序。

二分答案，然后对前 mid 的观察结果建图，看是否存在环以判断合法性。最后得到 X 后，把队列换成优先队列再做一次得到字典序最小的方案。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<queue>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=202000;
const int maxM=maxN<<1;
const int inf=2147483647;

int n,m;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],Dg[maxN];
vector<int> M[maxN];
priority_queue<int,vector<int>,greater<int> > H;
queue<int> Q;

void Add_Edge(int u,int v);
bool check(int mid);
void PushEdge(int limit);

int main(){
	scanf("%d%d",&n,&m);
	for (int i=1;i<=m;i++){
		int mi;scanf("%d",&mi);
		for (int j=1;j<=mi;j++){
			int u;scanf("%d",&u);
			M[i].push_back(u);
		}
	}
	int L=0,R=m,X=0;
	do{
		int mid=(L+R)>>1;
		if (check(mid)) X=mid,L=mid+1;
		else R=mid-1;
	}
	while (L<=R);

	PushEdge(X);
	for (int i=1;i<=n;i++) if (Dg[i]==0) H.push(i);
	do{
		int u=H.top();H.pop();printf("%d ",u);
		for (int i=Head[u];i!=-1;i=Next[i])
			if ((--Dg[V[i]])==0) H.push(V[i]);
	}
	while (!H.empty());
	printf("\n");return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;Dg[v]++;
	return;
}

bool check(int mid){
	PushEdge(mid);
	for (int i=1;i<=n;i++) if (Dg[i]==0) Q.push(i);
	int cnt=0;
	while (!Q.empty()){
		int u=Q.front();Q.pop();cnt++;
		for (int i=Head[u];i!=-1;i=Next[i])
			if ((--Dg[V[i]])==0) Q.push(V[i]);
	}
	return cnt==n;
}

void PushEdge(int limit){
	edgecnt=0;mem(Head,-1);mem(Dg,0);
	for (int i=1;i<=limit;i++)
		for (int j=1;j<M[i].size();j++)
			Add_Edge(M[i][j-1],M[i][j]);
	return;
}
```