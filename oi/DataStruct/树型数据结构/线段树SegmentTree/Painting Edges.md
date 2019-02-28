# Painting Edges
[CF576E]

给你一张n个点，m条边的无向图，每条边是k种颜色中的一种，满足所有颜色相同的边内部形成一个二分图。有q个询问，每次询问给出a,b代表将编号为a的边染成颜色b，但如果染色后不能满足所有颜色相同的边内部都是二分图就不染。问你每次是否能染成功。

采用线段树分治，对于每一种颜色维护一个并查集。但注意这里一条边的覆盖范围可能是在处理完某个询问之后才知道的，要特殊处理一下。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

const int maxN=500010;
const int maxK=51;

class Edge{
    public:
    int u,v,col;
};
class Question{
    public:
    int id,col,nxt;
};
class UndoStruct{
    public:
    int col,u,v,szu,belv;
};

int n,m,K,Q,lst[maxN];
Edge E[maxN];
Question Qe[maxN];
vector<int> Se[maxN<<2];
int ufs[maxK][maxN],label[maxK][maxN],size[maxK][maxN],undotop;
UndoStruct US[maxN*20];

void Modify(int x,int l,int r,int ql,int qr,int e);
int find(int col,int x);
int val(int col,int x);
bool Merge(int col,int u,int v);
void Divide(int x,int l,int r);

int main(){
    scanf("%d%d%d%d",&n,&m,&K,&Q);
    for (int i=1;i<=m;i++) scanf("%d%d",&E[i].u,&E[i].v);
    for (int i=1;i<=Q;i++){
        scanf("%d%d",&Qe[i].id,&Qe[i].col);
        if (lst[Qe[i].id]) Qe[lst[Qe[i].id]].nxt=i-1;
        lst[Qe[i].id]=i;
    }
    for (int i=1;i<=Q;i++) if (Qe[i].nxt==0) Qe[i].nxt=Q;
    for (int i=1;i<=K;i++) for (int j=1;j<=n;j++) ufs[i][j]=j,size[i][j]=1;
    Divide(1,1,Q);
    return 0;
}
#define ls (x<<1)
#define rs (ls|1)
void Modify(int x,int l,int r,int ql,int qr,int e){
    if (l==ql&&r==qr){
        Se[x].push_back(e);return;
    }
    int mid=(l+r)>>1;
    if (qr<=mid) Modify(ls,l,mid,ql,qr,e);
    else if (ql>=mid+1) Modify(rs,mid+1,r,ql,qr,e);
    else Modify(ls,l,mid,ql,mid,e),Modify(rs,mid+1,r,mid+1,qr,e);
    return;
}
int find(int col,int x){
    if (ufs[col][x]!=x) return find(col,ufs[col][x]);
    return ufs[col][x];
}
int val(int col,int x){
    if (ufs[col][x]!=x) return label[col][x]^val(col,ufs[col][x]);
    return label[col][x];
}
bool Merge(int col,int u,int v){
    int fu=find(col,u),fv=find(col,v);
    if (fu==fv) return val(col,u)!=val(col,v);
    if (size[col][fu]<size[col][fv]) swap(u,v),swap(fu,fv);
    US[++undotop]=((UndoStruct){col,fu,fv,size[col][fu],label[col][fv]});
    if (val(col,u)==val(col,v)) label[col][fv]^=1;
    label[col][fv]^=label[col][fu];
    size[col][fu]+=size[col][fv];ufs[col][fv]=fu;
    return 1;
}
void Divide(int x,int l,int r){
    int top=undotop,sz=Se[x].size()-1;
    for (int i=0;i<=sz;i++){
        int e=Se[x][i];
        Merge(E[e].col,E[e].u,E[e].v);
    }
    if (l==r){
        int b=Merge(Qe[l].col,E[Qe[l].id].u,E[Qe[l].id].v);
        if (b) puts("YES"),E[Qe[l].id].col=Qe[l].col;
        else puts("NO");
        if (l+1<=Qe[l].nxt) Modify(1,1,Q,l+1,Qe[l].nxt,Qe[l].id);
    }
    else{
        int mid=(l+r)>>1;Divide(ls,l,mid);
        int newsz=Se[x].size()-1;
        for (int i=sz+1;i<=newsz;i++){
            int e=Se[x][i];
            Merge(E[e].col,E[e].u,E[e].v);
        }
        Divide(rs,mid+1,r);
    }
    while (undotop!=top){
        size[US[undotop].col][US[undotop].u]=US[undotop].szu;
        ufs[US[undotop].col][US[undotop].v]=US[undotop].v;
        label[US[undotop].col][US[undotop].v]=US[undotop].belv;
        --undotop;
    }
    return;
}
```