# New Year and Finding Roots
[CF750F]

这是一道交互题  
有一棵高度为$h$的有根完全二叉树，点的编号从$1$到$2^h-1$。每一次你可以询问某一个点在树上的邻居，现在请你使用不超过$16$次询问找到树根。

任意找到一个点然后 dfs 直到叶子，这样可以确定二叉树上的一条路径，进而可以确定一个链上的最高点以得到深度。  
接下来的想法是，不断地向上找父亲，具体方法为，在第 $i$ 层进行深度为 $h-i$ 的 dfs 。因为从这个点出发只有两个点，如果最终找到的是叶子，说明这边不合法，父亲在另一边，否则父亲就在这一边。  
但这样做会超过限制。发现在第 3 层的时候，找到位于第 2 层的父亲代价过高，所以在第三层的时候改换 bfs ，只需要询问两层一共 6 个点询问 5 次，满足题目限制。

```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=510;

int n,H,St[maxN];
vector<int> T[maxN];
int vis[maxN];

void Ask(int id);
int main(){
    int Case;scanf("%d",&Case);
    while (Case--){
        scanf("%d",&H);n=(1<<H)-1;mem(vis,0);mem(St,0);
        if (H==0) exit(0);
        for (int i=1;i<maxN;i++) T[i].clear();
        int now=1,cnt=0,gr=0;
        while (1){
            Ask(now);St[++cnt]=now;
            if (T[now].size()==2){
                cout<<"! "<<now<<endl;fflush(stdout);gr=1;break;
            }
            bool flag=0;
            for (int i=0;i<T[now].size();i++) if (T[T[now][i]].size()==0) {flag=1;now=T[now][i];break;}
            if (flag==0) break;
        }
        if (gr) continue;
        if (T[1].size()==3){
            for (int i=0;i<T[1].size();i++) if (T[T[1][i]].size()==0) {now=T[1][i];break;}
            reverse(&St[1],&St[cnt+1]);
            while (1){
                Ask(now);St[++cnt]=now;
                if (T[now].size()==2){
                    cout<<"! "<<now<<endl;fflush(stdout);gr=1;break;
                }
                bool flag=0;
                for (int i=0;i<T[now].size();i++) if (T[T[now][i]].size()==0) {flag=1;now=T[now][i];break;}
                if (flag==0) break;
            }
        }
        if (gr) continue;

        now=St[cnt/2+1];int h=H-cnt/2-1,lst=St[cnt/2+1];
        if (T[now].size()==2){
            cout<<"! "<<now<<endl;fflush(stdout);continue;
        }
        for (int i=0;i<T[now].size();i++) if (T[now][i]!=St[cnt/2]&&T[now][i]!=St[cnt/2+2]) {now=T[now][i];break;}
        if (h==1){
            cout<<"! "<<now<<endl;fflush(stdout);continue;
        }
        if (h==2){
            int u=-1,v=-1;Ask(now);
            for (int i=0;i<T[now].size();i++) if (T[now][i]!=lst) (u==-1)?(u=T[now][i]):(v=T[now][i]);
            Ask(u);
            if (T[u].size()==2) cout<<"! "<<u<<endl;
            else cout<<"! "<<v<<endl;
            fflush(stdout);continue;
        }
        while (h>3){
            int limit=H-h,u=now;int top=0;St[0]=lst;
            for (int i=1;i<=limit;i++){
                Ask(u);St[++top]=u;
                if (T[u].size()==2){
                    cout<<"! "<<u<<endl;fflush(stdout);gr=1;break;
                }
                for (int j=0;j<T[u].size();j++) if (T[u][j]!=St[top-1]) {u=T[u][j];break;}
            }
            if (gr==1) break;
            Ask(u);St[++top]=u;
            if (T[u].size()==2){
                cout<<"! "<<u<<endl;fflush(stdout);gr=1;break;
            }
            if (T[u].size()==1){
                for (int i=0;i<T[now].size();i++) if (T[now][i]!=lst&&T[now][i]!=St[2]) {lst=now;now=T[now][i];break;}
            }
            else lst=now,now=St[2];
            --h;
        }
        if (gr) continue;
        Ask(now);
        int u=-1,v=-1;
        for (int i=0;i<T[now].size();i++) if (T[now][i]!=lst) (u==-1)?(u=T[now][i]):(v=T[now][i]);
        Ask(u);Ask(v);
        vector<int> L;
        for (int i=0;i<T[u].size();i++) if (T[u][i]!=now) L.push_back(T[u][i]);
        for (int i=0;i<T[v].size();i++) if (T[v][i]!=now) L.push_back(T[v][i]);
        Ask(L[0]);Ask(L[1]);Ask(L[2]);
        if (T[L[0]].size()==2) cout<<"! "<<L[0]<<endl;
        else if (T[L[1]].size()==2) cout<<"! "<<L[1]<<endl;
        else if (T[L[2]].size()==2) cout<<"! "<<L[2]<<endl;
        else cout<<"! "<<L[3]<<endl;
        fflush(stdout);
    }
    return 0;
}
void Ask(int id){
    if (vis[id]) return;
    cout<<"? "<<id<<endl;fflush(stdout);
    int cnt,x;cin>>cnt;if (cnt==0) exit(0);
    while (cnt--){
        cin>>x;T[id].push_back(x);
    }
    vis[id]=1;
    return;
}
```