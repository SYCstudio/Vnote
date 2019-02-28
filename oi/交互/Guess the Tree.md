# Guess the Tree
[CFGym101755I]

Jury has a complete binary tree with n = 2h - 1 vertices. Its vertices are numbered with distinct integers from 1 to n, but you don't know which vertices are connected with which.  
You can ask a jury's program, what is the distance between some two vertices. You must restore tree structure with at most 2.5·h·n such queries.

先询问两个点与全局的距离得到直径以及两个端点。得到直径的好处是，这样就可以分成两边分治来做。每次分成两边后一定至少已经知道其中一个叶子端点，不断寻找叶子和当前分治的顶，递归来做。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

const int maxN=1200;

int n;
int D[maxN][maxN],Seq[maxN],Fa[maxN],Bp[maxN];

void Get(int u,int v);
void Solve(int left,int l,int r,int fa);

int main(){
    scanf("%d",&n);
    int mxd=0,left,right;
    for (int i=1;i<=n;i++){
        Get(1,i);if (D[1][i]>mxd) mxd=D[1][i],left=i;
    }
    for (int i=1;i<=n;i++) Seq[i]=i;
    Solve(left,1,n,0);
    printf("! ");
    for (int i=1;i<=n;i++) printf("%d ",Fa[i]);printf("\n");
    return 0;
}
void Get(int u,int v){
    if (D[u][v]||u==v) return;
    printf("? %d %d\n",u,v);fflush(stdout);
    scanf("%d",&D[u][v]);D[v][u]=D[u][v];return;
}
void Solve(int left,int l,int r,int fa){
    if (l==r||l>r){
        if (l==r) Fa[Seq[l]]=fa;
        return;
    }
    int mxd=0,right;
    for (int i=l;i<=r;i++){
        Get(left,Seq[i]);
        if (D[left][Seq[i]]>mxd) mxd=D[left][Seq[i]],right=Seq[i];
    }
    for (int i=l;i<=r;i++) Get(right,Seq[i]);
    int ql=l-1,qr=r+1,mid;
    for (int i=l;i<=r;i++)
        if (D[left][Seq[i]]<D[right][Seq[i]]) Bp[++ql]=Seq[i];
        else if (D[right][Seq[i]]<D[left][Seq[i]]) Bp[--qr]=Seq[i];
        else mid=Seq[i];
    Fa[mid]=fa;
    for (int i=l;i<=r;i++) Seq[i]=Bp[i];
    Solve(left,l,ql,mid);Solve(right,qr,r,mid);
    return;
}
```