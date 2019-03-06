# [POI2013]CEN-Price List
[BZOJ3415 Luogu3547]

给一个无向图，边权均为a，然后将原来图中满足最短路等于2a所有的点对(x,y)之间再加一条长度为b的无向边，问操作之后点K到所有点的最短路是多少

新的最短路只有三种情况，一是仍然全部走 a ，二是把 a 没两个一组变成 b ，剩下的可能单出一个 a 单独算。这两种可以直接用 bfs 解决。问题在于第三种，即可能多走几个点使得所有的 b 都能两两配对是最优的。  
考虑一个这样的暴力算法，每次先得到一个点 u ，对 u 的出边作一轮扩展，然后对一轮扩展的点作二轮扩展，然后把二轮扩展的点加入队列。这样正确性能够保证，但时间复杂度最坏是 $O(m^2)$ 的。  
考虑优化，对于一轮扩展出的点 x ，如果它能扩展出一个二轮点 y 并且 y 不是一轮扩展的点，换句话说，u,x,y 不是三元环，那么 x-y 这条边在之后的所有二轮扩展中都不会被用到了，直接将它删掉。注意到这里删掉的是二轮扩展中的边，不能对一轮扩展造成影响。  
这样可以证明复杂度是 $O(m\sqrt{m})$ 的，具体证法是，每一轮未被删掉的边一定是三元环，那么对于一个度数为 $d$ 的点，三元环的最坏次数是 $d^2$ ，但是同时有又有总边数 $m$ 的限制，所以有 $\sum min(d^2,m)\le \sum\sqrt{d^2m}=\sum d\sqrt{m}=O(m\sqrt{m})$

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

const int maxN=101000;
const int maxM=maxN<<1;

class EDGE{
    public:
    int ecnt,Hd[maxN],Nt[maxM],V[maxM];
    EDGE(){
        ecnt=-1;memset(Hd,-1,sizeof(Hd));
    }
    void Add_Edge(int u,int v){
        Nt[++ecnt]=Hd[u];Hd[u]=ecnt;V[ecnt]=v;return;
    }
};

int n,m,S,A,B;
EDGE E1,E2;
int Qu[maxN],label[maxN],Ans[maxN],Mark[maxN];

int main(){
    scanf("%d%d%d%d%d",&n,&m,&S,&A,&B);
    for (int i=1;i<=m;i++){
        int u,v;scanf("%d%d",&u,&v);
        E1.Add_Edge(u,v);E1.Add_Edge(v,u);
        E2.Add_Edge(u,v);E2.Add_Edge(v,u);
    }
    memset(label,-1,sizeof(label));int ql=1,qr=1;label[Qu[1]=S]=0;
    while (ql<=qr) for (int u=Qu[ql++],i=E1.Hd[u];i!=-1;i=E1.Nt[i]) if (label[E1.V[i]]==-1) label[Qu[++qr]=E1.V[i]]=label[u]+1;
    for (int i=1;i<=n;i++) Ans[i]=min(label[i]*A,label[i]/2*B+(label[i]&1)*A);
    memset(label,-1,sizeof(label));label[Qu[ql=qr=1]=S]=0;
    while (ql<=qr){
        int u=Qu[ql++];
        for (int i=E1.Hd[u];i!=-1;i=E1.Nt[i]) Mark[E1.V[i]]=1;
        for (int i=E1.Hd[u];i!=-1;i=E1.Nt[i])
            for (int j=E2.Hd[E1.V[i]],lst=-1;j!=-1;j=E2.Nt[j])
                if (label[E2.V[j]]==-1&&!Mark[E2.V[j]]){
                    label[Qu[++qr]=E2.V[j]]=label[u]+1;
                    if (lst==-1) E2.Hd[E1.V[i]]=E2.Nt[j];
                    else E2.Nt[lst]=E2.Nt[j];
                }
                else lst=j;
        for (int i=E1.Hd[u];i!=-1;i=E1.Nt[i]) Mark[E1.V[i]]=0;
    }
    for (int i=1;i<=n;i++) if (label[i]!=-1) Ans[i]=min(Ans[i],label[i]*B);
    for (int i=1;i<=n;i++) printf("%d\n",Ans[i]);return 0;
}
```