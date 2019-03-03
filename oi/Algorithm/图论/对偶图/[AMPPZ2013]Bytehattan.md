# [AMPPZ2013]Bytehattan
[BZOJ4423]

比特哈顿镇有n*n个格点，形成了一个网格图。一开始整张图是完整的。  
有k次操作，每次会删掉图中的一条边(u,v)，你需要回答在删除这条边之后u和v是否仍然连通。

把图转成对偶图，那么删边就变成加边了，用并查集维护。如果在某一次询问前就已经连通，说明已经不连通。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

const int maxN=1510;

int n,Q,idcnt,Id[maxN][maxN];
int ufs[maxN*maxN];

int find(int x);
int main(){
    scanf("%d%d",&n,&Q);
    for (int i=1;i<n;i++) for (int j=1;j<n;j++) Id[i][j]=++idcnt;
    for (int i=0;i<n;i++) Id[0][i]=Id[i][0]=Id[n][i]=Id[i][n]=idcnt+1;
    for (int i=1;i<=idcnt+1;i++) ufs[i]=i;
    int lst=1;
    while (Q--){
        int a,b,c,d;char o1,o2;scanf("%d%d %c %d%d %c",&a,&b,&o1,&c,&d,&o2);
        if (!lst) swap(a,c),swap(b,d),swap(o1,o2);
        int u=Id[a][b],v;
        if (o1=='N') v=Id[a-1][b];
        else v=Id[a][b-1];
        if (find(u)==find(v)) lst=0;
        else lst=1;
        lst?puts("TAK"):puts("NIE");
        ufs[find(u)]=find(v);
    }
    return 0;
}
int find(int x){
    if (ufs[x]!=x) ufs[x]=find(ufs[x]);
    return ufs[x];
}
```