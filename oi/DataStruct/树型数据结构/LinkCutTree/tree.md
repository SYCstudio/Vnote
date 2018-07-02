# tree
[BZOJ2631 Luogu1501]

一棵n个点的树，每个点的初始权值为1。对于这棵树有q个操作，每个操作为以下四种操作之一：  
+ u v c：将u到v的路径上的点的权值都加上自然数c；  
- u1 v1 u2 v2：将树中原有的边(u1,v1)删除，加入一条新边(u2,v2)，保证操作完之后仍然是一棵树；  
* u v c：将u到v的路径上的点的权值都乘上自然数c；  
/ u v：询问u到v的路径上的点的权值和，求出答案对于51061的余数。

对应地打上标记进行操作。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define P(x,y) (x=(x+y)%Mod)
#define M(x,y) (x=1ll*x*y%Mod)

const int maxN=101000;
const int Mod=51061;
const int inf=2147483647;

class SplayData
{
public:
    int fa,ch[2];
    ll key,sum,add,mul;
    int rev,size;
};

int n,Q,St[maxN];
SplayData S[maxN];

bool Isroot(int u);
void Update(int u);
void PushDown(int u);
void Rev(int u);
void Add(int u,int c);
void Mul(int u,int c);
void Rotate(int u);
void Splay(int u);
void Access(int u);
void Makeroot(int u);
void Link(int u,int v);
void Cut(int u,int v);

int main()
{
    scanf("%d%d",&n,&Q);
    for (int i=1;i<=n;i++) S[i].key=S[i].mul=S[i].sum=S[i].size=1;
    for (int i=1;i<n;i++){
        int u,v;scanf("%d%d",&u,&v);
        Link(u,v);
    }
    while (Q--)
    {
        char opt;scanf(" %c",&opt);
        if (opt=='+')
        {
            int u,v,c;scanf("%d%d%d",&u,&v,&c);
            Makeroot(u);Access(v);Splay(u);Add(u,c);
        }
        if (opt=='-')
        {
            int u1,v1,u2,v2;scanf("%d%d%d%d",&u1,&v1,&u2,&v2);
            Cut(u1,v1);Link(u2,v2);
        }
        if (opt=='*')
        {
            int u,v,c;scanf("%d%d%d",&u,&v,&c);
            Makeroot(u);Access(v);Splay(u);Mul(u,c);
        }
        if (opt=='/')
        {
            int u,v;scanf("%d%d",&u,&v);
            Makeroot(u);Access(v);Splay(u);
            printf("%lld\n",S[u].sum);
        }
    }
    return 0;
}

bool Isroot(int u)
{
    if ((S[S[u].fa].ch[0]==u)||(S[S[u].fa].ch[1]==u)) return 0;
    return 1;
}

void Update(int u)
{
    S[u].sum=(S[S[u].ch[0]].sum+S[u].key+S[S[u].ch[1]].sum)%Mod;
	S[u].size=S[S[u].ch[0]].size+S[S[u].ch[1]].size+1;
    return;
}

void PushDown(int u){
    if (S[u].rev){
        if (S[u].ch[0]) Rev(S[u].ch[0]);
        if (S[u].ch[1]) Rev(S[u].ch[1]);
        S[u].rev=0;
    }
    if (S[u].mul!=1){
        if (S[u].ch[0]) Mul(S[u].ch[0],S[u].mul);
        if (S[u].ch[1]) Mul(S[u].ch[1],S[u].mul);
        S[u].mul=1;
    }
    if (S[u].add){
        if (S[u].ch[0]) Add(S[u].ch[0],S[u].add);
        if (S[u].ch[1]) Add(S[u].ch[1],S[u].add);
        S[u].add=0;
    }
    return;
}
    
void Rev(int u){
    S[u].rev^=1;swap(S[u].ch[0],S[u].ch[1]);return;
}

void Add(int u,int c){
    P(S[u].add,c);P(S[u].key,c);P(S[u].sum,c*S[u].size);return;
}

void Mul(int u,int c)
{
    M(S[u].mul,c);M(S[u].key,c);M(S[u].sum,c);
    if (S[u].add) M(S[u].add,c);
    return;
}

void Rotate(int x)
{
    int y=S[x].fa,z=S[y].fa;
    int sx=(x==S[y].ch[1]),sy=(y==S[z].ch[1]);
    S[x].fa=z;if (Isroot(y)==0) S[z].ch[sy]=x;
    S[y].ch[sx]=S[x].ch[sx^1];if (S[x].ch[sx^1]) S[S[x].ch[sx^1]].fa=y;
    S[x].ch[sx^1]=y;S[y].fa=x;
    Update(y);return;
}

void Splay(int x)
{
    int now=x;
    St[0]=0;St[++St[0]]=x;
    while (Isroot(now)==0){
        now=S[now].fa;St[++St[0]]=now;
    }
    while (St[0]) PushDown(St[St[0]--]);

    while (Isroot(x)==0)
    {
        int y=S[x].fa,z=S[y].fa;
        if (Isroot(y)==0)
            ((x==S[y].ch[0])^(y==S[z].ch[0]))?(Rotate(x)):(Rotate(y));
        Rotate(x);
    }
    Update(x);return;
}

void Access(int x){
    int lastx=0;
    while (x){
        Splay(x);S[x].ch[1]=lastx;Update(x);
        lastx=x;x=S[x].fa;
    }
    return;
}

void Makeroot(int u)
{
    Access(u);Splay(u);
    Rev(u);return;
}

void Link(int u,int v){
    Makeroot(u);S[u].fa=v;
    return;
}

void Cut(int u,int v){
    Makeroot(u);Access(v);Splay(v);
    S[v].ch[0]=S[u].fa=0;
	Update(u);Update(v);
    return;
}
```