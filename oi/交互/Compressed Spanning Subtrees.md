# Compressed Spanning Subtrees
[CFGym101741H]

题目见[附件](./_v_attachments/15
51279459_2118731899/CFGym101741H.pdf)

这个询问比较特别。首先考虑询问出所有的叶子，选择一个点，把其它所有点询问一边，如果返回的大小没有变大，说明这个点是叶子，否则不是。  
得到叶子之后，选择一个叶子为根，然后枚举每一个叶子和其它所有点，询问这两个点外加选定的根，这样可以得到每个叶子的祖先，以及每个节点作为了多少个叶子的祖先，记作 cnt 。由于不存在度数为 2 的点，所以从叶子到根的所有祖先的 cnt 是单调下降的，那么排序就可以确定祖先了。

```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=110;
int n;
int lcnt=0,Leaf[maxN],Sz[maxN],isl[maxN];
vector<int> Anc[maxN];
int Mp[maxN][maxN],Fa[maxN];

bool cmp(int a,int b);
void dfs(int u,int fa);
int main(){
    scanf("%d",&n);
    if (n==2){
        printf("! 1\n");
        return 0;
    }
    for (int i=1;i<=n;i++){
        printf("? %d ",n-1);for (int j=1;j<=n;j++) if (i!=j) printf("%d ",j);
        printf("\n");fflush(stdout);
        int In;scanf("%d",&In);
        if (In==n-1) isl[Leaf[++lcnt]=i]=1;
    }
    for (int i=2;i<=lcnt;i++){
        for (int j=1;j<=n;j++)
            if (isl[j]==0){
                printf("? 3 %d %d %d\n",Leaf[1],Leaf[i],j);fflush(stdout);
                int In;scanf("%d",&In);
                if (In==3) ++Sz[j],Anc[i].push_back(j);
            }
    }
    for (int i=2;i<=lcnt;i++){
        sort(Anc[i].begin(),Anc[i].end(),cmp);
        Mp[Leaf[i]][Anc[i][0]]=Mp[Anc[i][0]][Leaf[i]]=1;
        int sz=Anc[i].size();
        for (int j=1;j<sz;j++) Mp[Anc[i][j]][Anc[i][j-1]]=Mp[Anc[i][j-1]][Anc[i][j]]=1;
        Mp[Anc[i][sz-1]][Leaf[1]]=Mp[Leaf[1]][Anc[i][sz-1]]=1;
    }
    dfs(1,0);
    printf("! ");
    for (int i=2;i<=n;i++) printf("%d ",Fa[i]);return 0;
}
bool cmp(int a,int b){
    return Sz[a]<Sz[b];
}
void dfs(int u,int fa){
    Fa[u]=fa;
    for (int i=1;i<=n;i++) if (Mp[u][i]&&i!=fa) dfs(i,u);
    return;
}
```