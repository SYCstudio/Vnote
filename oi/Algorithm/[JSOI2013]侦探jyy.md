# [JSOI2013]侦探jyy
[BZOJ4478]

JSOI 的世界里一共有 N 个不同的事件（ 依次由 1 到 N 编号），以及 M 条线索。  
每一条线索对应一个二元组(x,y)，表示事件 x 发生会导致事件 y 发生——注意： 线索是单向的，也就是如果 y 发生了，并不代表 x 一定会发生。  
线索是有传递性的， 即如果存在线索(x,y)以及(y,z)， 那么 x 发生则会导致 z发生。  
同时由于世界是合理的，任意一个事件 x 一定不会通过某些线索导致事件 x本身发生。  
另外，整个世界仅包含这 M 条线索， 我们不认为一些事件会凭空发生（就像福尔摩斯永远不会认为诡异的凶杀案是源于神的谴责）。具体而言： 对于某个事件 x， 如果 x 发生了，并且存在某个事件可能导致 x 发生，那么一定至少有一个可能导致 x 发生的事件发生了。  
现在已知世界上的 M 条线索，以及 D 个已经发生的事件，那么由此推断，哪些事件一定已经发生了呢？

一个事件能够不发生，当且仅当它的父系事件中没有必须发生的，并且它不发生不会导致某个会发生的事件不能发生。转化成图论语言，即 DAG 中所有能到达它的点中没有必须发生的事件；将所有能到达它的点设置为禁止，强制让剩下的入度为 0 的事件全部发生并传递，不存在应该发生的事件没有发生。在拓扑图上判断这两点，满足要求的即可以不发生，反之强制发生。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010;

int n,m,D;
int Mt[maxN],U[maxN],Ans[maxN],acnt;
vector<int> T1[maxN],T2[maxN];
int tim,Tim[maxN],Qu[maxN];

bool check(int S);

int main(){
    scanf("%d%d%d",&n,&m,&D);
    for (int i=1;i<=m;i++){
	int u,v;scanf("%d%d",&u,&v);
	T1[u].push_back(v);T2[v].push_back(u);
    }
    for (int i=1;i<=D;i++) scanf("%d",&Mt[i]),U[Mt[i]]=1;
    
    for (int i=1;i<=n;i++) if (U[i]||check(i)) Ans[++acnt]=i;
    for (int i=1;i<=acnt;i++){
	if (i!=1) printf(" ");
	printf("%d",Ans[i]);
    }
    printf("\n");return 0;
}
bool check(int S){
    ++tim;int ql=1,qr=1;Qu[1]=S;Tim[S]=tim;
    while (ql<=qr) for (int u=Qu[ql++],i=0,sz=T2[u].size();i<sz;i++) if (Tim[T2[u][i]]!=tim) Tim[T2[u][i]]=tim,Qu[++qr]=T2[u][i];
    for (int i=1;i<=D;i++) if (Tim[Mt[i]]==tim) return 1;
    ql=1;qr=0;for (int i=1;i<=n;i++) if (Tim[i]!=tim&&T2[i].size()==0) Tim[Qu[++qr]=i]=tim;
    while (ql<=qr) for (int u=Qu[ql++],i=0,sz=T1[u].size();i<sz;i++) if (Tim[T1[u][i]]!=tim) Tim[T1[u][i]]=tim,Qu[++qr]=T1[u][i];
    for (int i=1;i<=D;i++) if (Tim[Mt[i]]!=tim) return 1;
    return 0;
}
```